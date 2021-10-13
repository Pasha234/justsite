<?php
try{
  require('db.php');
} catch (PDOException $e) {
  $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
  $handle = fopen('log.txt', 'a');
  fwrite($handle, $err_text);
  fclose($handle);
  throw new Exception("Error Processing Request", 0);
}

if("POST" == $_SERVER['REQUEST_METHOD']){
  list($input, $errors, $defaults) = validate_form($db);
  if(!$errors){
    $hash = md5($input['email'] . time());
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "To: <$input[email]>\r\n";
    $headers .= "From: <justsite.online\r\n";
    $message = '
    <html>
    <head>
    <title>Подтвердите Email</title>
    </head>
    <body>
    <p>Что бы подтвердить Email, перейдите по <a href="http://justsite.online/confirm?hash=' . $hash . '">ссылке</a></p>
    </body>
    </html>
    ';
    if(mail($input['email'], "Подтвердите e-mail на сайте", $message, $headers)){
      $input['hash'] = $hash;
      process_form($input, $db);
    } else {
      $errors = ['Произошла ошибка при отправке письма, проверьте правильность написания электронной почты.'];
      show_form($errors, $defaults);
    }
  } else {
    show_form($errors, $defaults);
  }
} else {
  show_form();
}

function show_form($errors=false, $defaults=false) {
  if (isset($_COOKIE['PHPSESSID'])) {
    header("Location: http://$_SERVER[HTTP_HOST]/personal");
  }
  include('templates/header.html');
  include('modules/sidebar/sidebar.php');
  print <<<_HTML
  <div class="content">
    <div class="register__container">
      <form action="$_SERVER[REQUEST_URI]" class="register__form" method="post">
        <div class="register__login">
          <label class="register__header" for="login" title="Имя вашей учетной записи, которое будет отображаться другим пользователям">Имя пользователя</label>
  _HTML;

  if(isset($defaults['login'])){
    print '<input id="login" name="login" type="text" class="register__input" required autocomplete="username" maxlength="32" title="Имя пользователя должно быть менее или равно по величине 32 символам" value="' . $defaults['login'] . '">';
  } else {
    print '<input id="login" name="login" type="text" class="register__input" required autocomplete="username" maxlength="32" title="Имя пользователя должно быть менее или равно по величине 32 символам">';
  }

  print <<<_HTML2
  </div>
    <div class="register__email">
      <label class="register__header" for="email" title="Электронная почта нужна только для подтверждения личности">E-mail</label>
  _HTML2;

  if(isset($defaults['email'])){
    print '<input id="email" name="email" type="email" class="register__input" required autocomplete="email" maxlength="100" value="' . $defaults['email'] . '">';
  } else {
    print '<input id="email" name="email" type="email" class="register__input" required autocomplete="email" maxlength="100">';
  }

  print <<<_HTML3
        </div>
        <div class="register__password">
          <label class="register__header" for="password">Пароль</label>
          <input id="password" name="password" type="password" class="register__input" required autocomplete="new-password">
        </div>
        <input type="submit" class="register__submit" value="Создать аккаунт">
  _HTML3;

  if(is_array($errors) && $errors) {
    print '<ul class="register__errors"><li class="register__err">' . implode('</li><li class="register__err">', $errors) . '</li></ul>';
  }

  print <<<_HTML4
      </form>
    </div>
  </div>
  _HTML4;
  include('templates/footer.html');
}

function validate_form($db) {
  $input = [];
  $errors = [];
  $defaults = [];
  # Проверка в базе данных на совпадение никнеймов и почт
  $stmt = $db->prepare('SELECT * FROM users where nickname=?');
  $stmt->execute(array($_POST['login']));
  $stmt2 = $db->prepare('SELECT * FROM users where email=?');
  $stmt2->execute(array($_POST['email']));
  # Логин
  if($_POST['login']){
    if(!$stmt->fetch()){
      $input['login'] = htmlentities($_POST['login']);
    } else {
      $errors[] = "Пользователь с таким логином уже существует";
    }
  } else {
    $errors[] = "Поле \"Имя пользователя\" пустое";
  }
  $defaults['login'] = $_POST['login'];
  # Почта
  if($_POST['email']){
    if(!$result = $stmt2->fetch()){
      $input['email'] = $_POST['email'];
    } else {
      if ($result['email_confirmed'] == 0) {
        $input['delete_email'] = 1;
        $input['email'] = $_POST['email'];
      } else {
        $errors[] = "Данный e-mail уже зарегистрирован другим пользователем";
      }
    }
  } else {
    $errors[] = "Поле \"E-mail\" пустое";
  }
  $defaults['email'] = $_POST['email'];
  # Пароль
  if($_POST['password']){
    $input['password'] = password_hash($_POST['password'], PASSWORD_DEFAULT);
  } else {
    $errors[] = "Поле \"Пароль\" пустое";
  }
  return array($input, $errors, $defaults);
}

function process_form($input, $db){
  try{
    if (isset($input['delete_email']) && $input['delete_email'] == 1) {
      $stmt2 = $db->prepare('DELETE FROM users where email=?');
      $stmt2->execute(array($input['email']));
    }
    $stmt = $db->prepare('INSERT into users (nickname, email, password, hash) VALUES (?, ?, ?, ?)');
    $stmt->execute(array($input['login'], $input['email'], $input['password'], $input['hash']));
    header("Location: http://$_SERVER[HTTP_HOST]/confirm");
  } catch (PDOException $e){
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    throw new Exception("Error Processing Request", 0);
  } 
}
?>