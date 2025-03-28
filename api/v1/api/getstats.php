<?php
function getNpmPackageStats($packageName) {
    try {
        $packageInfoUrl = "https://registry.npmjs.org/{$packageName}";
        
        $packageInfoCurl = curl_init($packageInfoUrl);
        
        $curlOptions = [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['User-Agent: PhpStats+https://urltoapp.xyz']
        ];
        
        curl_setopt_array($packageInfoCurl, $curlOptions);
        
        $packageInfoResponse = curl_exec($packageInfoCurl);
        
        if (curl_errno($packageInfoCurl)) {
            throw new Exception('Npm err');
        }
        
        $packageInfo = json_decode($packageInfoResponse, true);
        
        $totalDownloadsUrl = "https://api.npmjs.org/downloads/point/1000-01-01:" . date('Y-m-d') . "/{$packageName}";
        $totalDownloadsCurl = curl_init($totalDownloadsUrl);
        
        curl_setopt_array($totalDownloadsCurl, $curlOptions);
        
        $totalDownloadsResponse = curl_exec($totalDownloadsCurl);
        
        if (curl_errno($totalDownloadsCurl)) {
            throw new Exception('Dwnld err');
        }
        
        $totalDownloadsData = json_decode($totalDownloadsResponse, true);
        
        $githubRepo = $packageInfo['repository']['url'] ?? '';
        $githubRepoPath = str_replace(['git+', 'https://github.com/', '.git'], '', $githubRepo);
        
        $githubIssuesUrl = "https://api.github.com/repos/{$githubRepoPath}/issues";
        $githubIssuesCurl = curl_init($githubIssuesUrl);
        
        curl_setopt_array($githubIssuesCurl, $curlOptions);
        
        $githubIssuesResponse = curl_exec($githubIssuesCurl);
        
        if (curl_errno($githubIssuesCurl)) {
            throw new Exception('Github err');
        }
        
        $githubIssuesData = json_decode($githubIssuesResponse, true);
        
        curl_close($packageInfoCurl);
        curl_close($totalDownloadsCurl);
        curl_close($githubIssuesCurl);
        
        $stats = [
            'version' => $packageInfo['dist-tags']['latest'] ?? 'N/A',
            'downloads' => $totalDownloadsData['downloads'] ?? 0,
            'issues' => is_array($githubIssuesData) ? count($githubIssuesData) : 0
        ];
        
        return $stats;
        
    } catch (Exception $e) {
        error_log($e->getMessage());
        return null;
    }
}

$stats = getNpmPackageStats('u2a');

if ($stats) {
    header('Content-Type: application/json');
    echo json_encode($stats, JSON_PRETTY_PRINT);
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => '._.'], JSON_PRETTY_PRINT);
}
?>