<?php

$publicKey = 'p0QltE6gCkv0TdTtlOilmrMDo66EcJtAHllmrnEjlNTq8j60Qlb7qdWzfKCfOy8u';
$privateKey = 'LC5kUXrHjFx8djxa1Xfy700WeHLYiemMpFMHngkV8eLhH6xBcs0AKPQCDqtqHNS3';
// Generate HMAC for VideoBlocks API Authentication
$time = time();
echo $time;
?><br><?php>
$resource = '/api/v1/stock-items/search/';
$keyword = 'preflight';
$hmac = hash_hmac('sha256', $resource, $privateKey . $time);
// echo $hmac;
$url = 'https://api.videoblocks.com'.$resource.'?APIKEY='.$publicKey.'&HMAC'.$hmac.'&EXPIRES='.$time.'&keywords='.$keyword;
echo $url;
echo '<br>';
$session = curl_init();
curl_setopt($session, CURLOPT_URL, $url);
curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false​);
$result = curl_exec($session);
curl_close($session);
print_r($result);
?>
