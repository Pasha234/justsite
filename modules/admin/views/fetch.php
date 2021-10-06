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
if($_SERVER['REQUEST_METHOD'] == 'GET'){
  if(isset($_GET['users']) && $_GET['users'] == 1) {
    try{
      require('../../../db.php');
      $dbreq = $db->prepare("SELECT * from users");
      $dbreq->execute();
      $users = [];
      $counter = 1;
      while ($userRaw = $dbreq->fetch()) {
        $user = array('id' => $userRaw['id'], 'nickname' => $userRaw['nickname'], 'deleted' => $userRaw['deleted']);
        $users[$counter] = $user;
        $counter++;
      }
      echo json_encode(array('success' => 1, 'users' => $users));
    } catch(PDOException $e){
      $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
      $handle = fopen('log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
    }
  } else if (isset($_GET['user'])){
    try{
      require('../../../db.php');
      $dbreq = $db->prepare("SELECT * FROM users WHERE id=?");
      $dbreq->execute(array($_GET['user']));
      $user = $dbreq->fetch();
      if ($user) {
        echo json_encode(array('success' => 1, 'user' => $user));
      } else {
        echo json_encode(array('success' => 0, 'error' => 'Пользователя с таким id нет'));
      }
    } catch (PDOException $e) {
      $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
      $handle = fopen('log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
    }
  } else if (isset($_GET['entries']) && $_GET['entries'] == 1) {
    try{
      require('../../../db.php');
      $dbreq = $db->prepare("SELECT * from entries");
      $dbreq->execute();
      $entries = [];
      $counter = 1;
      while ($entryRaw = $dbreq->fetch()) {
        $entry = array('id' => $entryRaw['id'], 'text' => $entryRaw['text'], 'deleted' => $entryRaw['deleted']);
        $entries[$counter] = $entry;
        $counter++;
      }
      echo json_encode(array('success' => 1, 'entries' => $entries));
    } catch(PDOException $e){
      $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
      $handle = fopen('log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
    }
  } else if (isset($_GET['entry'])) {
    try{
      require('../../../db.php');
      $dbreq = $db->prepare("SELECT * FROM entries WHERE id=?");
      $dbreq->execute(array($_GET['entry']));
      $entry = $dbreq->fetch();
      if ($entry) {
        echo json_encode(array('success' => 1, 'entry' => $entry));
      } else {
        echo json_encode(array('success' => 0, 'error' => 'Записи с таким id нет'));
      }
    } catch (PDOException $e) {
      $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
      $handle = fopen('log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
    }
  }
} else {
  print "Тут ничего нет";
}
?>