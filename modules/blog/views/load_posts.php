<?php
header('Content-Type: application/json');
if($_SERVER['REQUEST_METHOD'] == 'GET'){
  if(isset($_GET['page'])) {
    try{
      require('../../../db.php');
      $dbreq = $db->prepare("SELECT * from entries WHERE deleted=0 ORDER BY add_time DESC LIMIT ?, 10");
      $dbreq->execute(array(($_GET['page'] - 1) * 10));
      $posts = [];
      $counter = 1;
      while ($card = $dbreq->fetch()) {
        $user = $db->query("SELECT * from users where id = " . $card['user_id'])->fetch();
        $post = array('text' => $card['text'], 'img' => $card['img'], 'user_name' => $user['nickname'], 'user_avatar' => $user['avatar'], 'user_id' => $user['id'], 'user_deleted' => $user['deleted']);
        $posts[$counter] = $post;
        $counter++;
      }
      echo json_encode(array('success' => 1, 'posts' => $posts));
    } catch(PDOException $e){
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