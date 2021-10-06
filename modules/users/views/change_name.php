<?php
if (isset($_COOKIE['PHPSESSID'])){
  session_start();
} else {
  echo json_encode(array('success' => 0));
  exit;
}
if (isset($_POST['check_changes'])) {
  try{
    require('../../../db.php');
    $checkRequest = $db->prepare('SELECT * FROM users WHERE id = ?');
    $checkRequest->execute(array($_SESSION['id']));
    $changes = $checkRequest->fetch();
    echo json_encode(array('success' => 1, 'changes' => $changes['nickname_changes']));
    exit;
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Ошибка: Не удалось подключиться к базе данных'));
    exit;
  }
}
if (isset($_POST['new_name']) && $_POST['new_name']) {
  try{
    $new_name = htmlentities($_POST['new_name']);
    require('../../../db.php');
    $validateRequest = $db->prepare('SELECT * FROM users WHERE nickname = ?');
    $validateRequest->execute(array($new_name));
    if ($match_name=$validateRequest->fetch()) {
      echo json_encode(array('success' => 0, 'error' => "Ошибка: Имя $match_name[nickname] уже занято"));
      exit;
    }
    $changesRequest = $db->prepare('SELECT * FROM users WHERE id = ?');
    $changesRequest->execute(array($_SESSION['id']));
    $result = $changesRequest->fetch();
    if ($result['nickname_changes'] > 0) {
      $stmt = $db->prepare('UPDATE users SET nickname = ?, nickname_changes = ? WHERE id = ?');
      $stmt->execute(array($new_name, --$result['nickname_changes'], $_SESSION['id']));
      $stmt->fetch();
      $_SESSION['nickname'] = $new_name;
      echo json_encode(array('success' => 1, 'new_name' => $new_name));
    } else {
      echo json_encode(array('success' => 0, 'error' => 'Вы исчерпали лимит смены имен'));
    }
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Ошибка: Не удалось внести изменения'));
  }
} else {
  echo json_encode(array('success' => 0, 'error' => 'Ошибка: Не введено новое имя'));
}
?>