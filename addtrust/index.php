<?php
$jsonFile = '../assets/js/trust.json';

$securePassword = "SuPeRsEcUrEPwD";

$password = isset($_REQUEST['pass']) ? $_REQUEST['pass'] : '';
$name = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
$image = isset($_REQUEST['image']) ? $_REQUEST['image'] : '';
$url = isset($_REQUEST['url']) ? $_REQUEST['url'] : '';

$response = [
    'success' => false,
    'message' => ''
];

if ($password !== $securePassword) {
    $response['message'] = 'Incorrect password';
    echo json_encode($response);
    exit;
}

if (empty($name) || empty($image) || empty($url)) {
    $response['message'] = 'All fields (name, image, url) are required';
    echo json_encode($response);
    exit;
}

if (!file_exists($jsonFile)) {
    $response['message'] = 'JSON file not found';
    echo json_encode($response);
    exit;
}

$jsonContent = file_get_contents($jsonFile);
if ($jsonContent === false) {
    $response['message'] = 'Unable to read JSON file';
    echo json_encode($response);
    exit;
}

$partners = json_decode($jsonContent, true);
if ($partners === null) {
    $response['message'] = 'Error in JSON file format';
    echo json_encode($response);
    exit;
}

foreach ($partners as $partner) {
    if ($partner['name'] === $name) {
        $response['message'] = 'A partner with this name already exists';
        echo json_encode($response);
        exit;
    }
}

$newPartner = [
    'name' => $name,
    'image' => $image,
    'url' => $url
];

$partners[] = $newPartner;

$newJsonContent = json_encode($partners, JSON_PRETTY_PRINT);

if (file_put_contents($jsonFile, $newJsonContent) === false) {
    $response['message'] = 'Unable to write to JSON file';
    echo json_encode($response);
    exit;
}

$response['success'] = true;
$response['message'] = 'Partner successfully added';
echo json_encode($response);
?>