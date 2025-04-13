<?php
$config = [
    'db' => [
        'host' => 'localhost',
        'user' => 'dbuser',
        'pass' => 'dbpass',
        'name' => 'dbname'
    ],
    'discord' => [
        'webhook_url' => 'wbkurl'
    ]
];

$previousVersion = isset($_GET['previousVersion']) ? $_GET['previousVersion'] : null;
$newVersion = isset($_GET['newVersion']) ? $_GET['newVersion'] : null;
$timestamp = isset($_GET['timestamp']) ? $_GET['timestamp'] : date('Y-m-d H:i:s');

if (!$previousVersion || !$newVersion) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters: previousVersion, newVersion']);
    exit;
}

$mysqli = new mysqli(
    $config['db']['host'],
    $config['db']['user'],
    $config['db']['pass'],
    $config['db']['name']
);

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$mysqli->query("CREATE TABLE IF NOT EXISTS global_stats (total_installs INT NOT NULL DEFAULT 0)");
$mysqli->query("CREATE TABLE IF NOT EXISTS version_stats (
    version VARCHAR(20) PRIMARY KEY,
    active_users INT NOT NULL DEFAULT 0
)");
$mysqli->query("CREATE TABLE IF NOT EXISTS install_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    previous_version VARCHAR(20) NOT NULL,
    new_version VARCHAR(20) NOT NULL,
    timestamp DATETIME NOT NULL,
    event_type ENUM('install', 'upgrade') NOT NULL
)");

$mysqli->begin_transaction();

try {
    $mysqli->query("UPDATE global_stats SET total_installs = total_installs + 1");

    if ($mysqli->affected_rows == 0) {
        $mysqli->query("INSERT INTO global_stats (total_installs) VALUES (1)");
    }

    $isNewInstall = ($previousVersion === '0.0.0');

    $stmt = $mysqli->prepare("INSERT INTO version_stats (version, active_users)
                             VALUES (?, 1)
                             ON DUPLICATE KEY UPDATE active_users = active_users + 1");
    $stmt->bind_param("s", $newVersion);
    $stmt->execute();
    $stmt->close();

    if (!$isNewInstall) {
        $stmt = $mysqli->prepare("UPDATE version_stats SET active_users = active_users - 1 WHERE version = ? AND active_users > 0");
        $stmt->bind_param("s", $previousVersion);
        $stmt->execute();
        $stmt->close();
    }

    $eventType = $isNewInstall ? 'install' : 'upgrade';
    $stmt = $mysqli->prepare("INSERT INTO install_logs (previous_version, new_version, timestamp, event_type) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $previousVersion, $newVersion, $timestamp, $eventType);
    $stmt->execute();
    $stmt->close();

    $mysqli->commit();

    $result = $mysqli->query("SELECT total_installs FROM global_stats");
    $totalInstalls = $result->fetch_assoc()['total_installs'];

    $message = $isNewInstall
        ? "🎉 u2a has been installed ! version {$newVersion}"
        : "⬆️ u2a has been upgraded ! {$previousVersion} → {$newVersion}";

    $discordPayload = [
        'content' => $message,
        'embeds' => [
            [
                'title' => $isNewInstall ? 'New u2a install !' : 'New u2a upgrade !',
                'color' => $isNewInstall ? 5025616 : 7506394,
                'fields' => [
                    [
                        'name' => 'Ancienne Version',
                        'value' => $previousVersion,
                        'inline' => true
                    ],
                    [
                        'name' => 'Nouvelle Version',
                        'value' => $newVersion,
                        'inline' => true
                    ],
                    [
                        'name' => 'Timestamp',
                        'value' => $timestamp,
                        'inline' => false
                    ]
                ],
                'footer' => [
                    'text' => "Total installations: {$totalInstalls}"
                ]
            ]
        ]
    ];

    $ch = curl_init($config['discord']['webhook_url']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordPayload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);

    http_response_code(200);
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $mysqli->rollback();

    http_response_code(500);
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}

$mysqli->close();
?>
