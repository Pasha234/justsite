<?php
function uploadImage(String $file) {
  $addParams = ["folder" => "JustSite", "timestamp" => time()];
  $API_SECRET = '';
  $API_KEY = '';
  $signatureString = '';
  foreach ($addParams as $key => $value) {
    $signatureString .= $key . '=' . $value . '&';
  }
  $signatureString = rtrim($signatureString, '&');
  $signatureString .= $API_SECRET;
  $signature = sha1($signatureString);

  $c = curl_init("https://api.cloudinary.com/v1_1/dqqrkxkrv/image/upload");
  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, array_merge($addParams, array('file' => new CURLFile($file), 'api_key' => $API_KEY, 'signature' => $signature)));
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  return json_decode(curl_exec($c), true);
}

function deleteImage(String $link) {
  $match = [];
  preg_match('/([^\/]+).jpg$/m', $link, $match);
  $addParams = ["public_id" => 'JustSite/' . $match[1], 'timestamp' => time()];
  $API_SECRET = '';
  $API_KEY = '';
  $signatureString = '';
  foreach ($addParams as $key => $value) {
    $signatureString .= $key . '=' . $value . '&';
  }

  $signatureString = rtrim($signatureString, '&');
  $signatureString .= $API_SECRET;
  $signature = sha1($signatureString);

  $c = curl_init("https://api.cloudinary.com/v1_1/dqqrkxkrv/image/destroy");
  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, array_merge($addParams, array('api_key' => $API_KEY, 'signature' => $signature)));
  curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
  return json_decode(curl_exec($c), true);
}
?>