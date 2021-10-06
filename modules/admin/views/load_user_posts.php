<?php
header('Content-Type: application/json');
if (!isset($_COOKIE['PHPSESSID'])) {
  echo json_encode(array('success' => 0));
  exit;
} else {
  session_start();
}
if (!(isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1)) {
  echo json_encode(array('success' => 0));
  exit;
}
if (isset($_GET['user']) && $_GET['user']) {
  try{
    require('../../../db.php');
    $dbreq = $db->prepare('SELECT * FROM entries WHERE user_id=?');
    $dbreq->execute(array($_GET['user']));
    $posts = $dbreq->fetchAll();
    echo json_encode(array('success' => 1, 'posts' => $posts));
  } catch(PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
  }
} else {
  echo json_encode(array('success' => 0));
}
?>