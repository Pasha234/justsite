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
if ((isset($_POST['delete']) && $_POST['delete'] == 1) && (isset($_POST['user']) && $_POST['user'])) {
  try{
    require('../../../db.php');
    $dbreq = $db->prepare('UPDATE `users` SET deleted = 1 WHERE id = ?');
    $dbreq->execute(array($_POST['user']));
    $dbreq->fetch();
    echo json_encode(array('success' => 1));
  } catch(PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
  }
} else if ((isset($_POST['restore']) && $_POST['restore'] == 1) && (isset($_POST['user']) && $_POST['user'])) {
  try{
    require('../../../db.php');
    $dbreq = $db->prepare('UPDATE `users` SET deleted = 0 WHERE id = ?');
    $dbreq->execute(array($_POST['user']));
    $dbreq->fetch();
    echo json_encode(array('success' => 1));
  } catch(PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
  }
} else if (isset($_POST['nickname_changes']) && (isset($_POST['user']) && $_POST['user'])) {
  try{
    require('../../../db.php');
    $dbreq = $db->prepare('UPDATE `users` SET nickname_changes = ? WHERE id = ?');
    $dbreq->execute(array($_POST['nickname_changes'], $_POST['user']));
    $dbreq->fetch();
    echo json_encode(array('success' => 1));
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