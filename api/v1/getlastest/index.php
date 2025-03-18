<?php
header('Content-Type: text/plain');

$npmApiUrl = 'https://registry.npmjs.org/u2a';

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $npmApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'BOT U2A_VersionCheck');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'X';
    exit;
}

curl_close($ch);

$packageInfo = json_decode($response, true);

if ($packageInfo === null) {
    echo 'X';
    exit;
}

if (isset($packageInfo['dist-tags']['latest'])) {
    $latestVersion = $packageInfo['dist-tags']['latest'];
    echo $latestVersion;
} else {
    echo 'X';
}
?>