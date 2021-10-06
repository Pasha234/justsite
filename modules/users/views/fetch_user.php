<?php
header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] == 'GET'){
  if (isset($_GET['user'])){
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
      $handle = fopen('../../../log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      echo json_encode(array('success' => 0, 'error' => 'Не удалось установить соединение - перезагрузите страницу или попробуйте позже'));
    }
  }
} else {
  print "Тут ничего нет";
}
?>