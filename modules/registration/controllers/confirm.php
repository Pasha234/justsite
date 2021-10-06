<?php
function action_confirm() {
  if(isset($_COOKIE['PHPSESSID'])) {
    session_start();
    include('templates/header.html');
    include('modules/sidebar/sidebar.php');
    print <<<_HTML
    <div class="content">
      <div class="confirm__container">
        <h2>Ваш e-mail уже подтвержден :)</h2>
        <a href="/">На главную</a>
      </div>
    </div>
    _HTML;
    include('templates/footer.html');
    exit;
  }
  if(isset($_GET['hash'])){
    $hash = $_GET['hash'];
    try{
      require('db.php');
      $stmt = $db->prepare("SELECT * FROM users WHERE hash=?");
      $stmt->execute(array($hash));
      $result = $stmt->fetch();
    } catch (PDOException $e){
      $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
      $handle = fopen('log.txt', 'a');
      fwrite($handle, $err_text);
      fclose($handle);
      throw new Exception("Error Processing Request", 0);
    }
    if($result){
      if($result['email_confirmed'] == 0){
        $upd = $db->prepare("UPDATE users SET email_confirmed=1 WHERE id=?");
        $upd->execute(array($result['id']));
        session_start();
        $_SESSION['nickname'] = $result['nickname'];
        $_SESSION['id'] = $result['id'];
        $_SESSION['avatar'] = $result['avatar'];
        header("Location: http://$_SERVER[HTTP_HOST]/personal");
      } else {
        include('templates/header.html');
        include('modules/sidebar/sidebar.php');
        print <<<_HTML
        <div class="content">
          <div class="confirm__container">
            <h2>Ваш e-mail уже подтвержден :)</h2>
            <a href="/">На главную</a>
          </div>
        </div>
        _HTML;
        include('templates/footer.html');
      }
    } else {
      include('templates/header.html');
      include('modules/sidebar/sidebar.php');
      print <<<_HTML
      <div class="content">
        <div class="confirm__container">
          <h2>Что-то пошло не так</h2>
          <a href="/">На главную</a>
        </div>
      </div>
      _HTML;
      include('templates/footer.html');
    }
  } else {
    include('templates/header.html');
    include('modules/sidebar/sidebar.php');
    print '<div class="content">';
    print <<<_HTML
    _HTML;
    print <<<_HTML
    <div class="content">
      <div class="confirm__container">
        <h2>Замечательно!</h2>
        <p>Регистрация прошла успешно. Мы будем ждать вашего подтверждения.</p>
        <a href="/">На главную</a>
      </div>
    </div>
    _HTML;
    include('templates/footer.html');
  }
}

?>