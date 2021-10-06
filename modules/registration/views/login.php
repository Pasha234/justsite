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

if (isset($_COOKIE['PHPSESSID'])) {
  header("Location: http://$_SERVER[HTTP_HOST]/personal");
}

if ('POST' == $_SERVER['REQUEST_METHOD']) {
  list($input, $errors, $defaults) = validate_form($db);
  if (!$errors) {
    process_form($input);
  } else {
    show_form($errors, $defaults);
  }
} else {
  show_form();
}

function validate_form ($db) {
  $input = [];
  $defaults = [];
  $errors = [];
  # Логин или пароль - пустые
  if (isset($_POST['login'])) {
    $input['login'] = trim($_POST['login']);
    if (!$input['login']) {
      $errors[] = "Поле \"Логин\" пустое";
      return array($input, $errors, $defaults);
    }
  } else {
    $errors[] = "Поле \"Логин\" пустое";
    return array($input, $errors, $defaults);
  }
  if (isset($_POST['password'])) {
    $input['password'] = trim($_POST['password']);
    if (!$input['password']) {
      $errors[] = "Поле \"Пароль\" пустое";
      return array($input, $errors, $defaults);
    }
  } else {
    $errors[] = "Поле \"Пароль\" пустое";
    return array($input, $errors, $defaults);
  }
  $stmt = $db->prepare('SELECT * FROM users WHERE email=? AND deleted=0');
  $stmt->execute(array($input['login']));
  if ($result=$stmt->fetch()) {
    if ($result['email_confirmed']) {
      if (password_verify($input['password'], $result['password'])) {
        $input['id'] = $result['id'];
        if ($result['is_admin']) {
          $input['is_admin'] = 1;
        }
        $input['nickname'] = $result['nickname'];
        $input['avatar'] = $result['avatar'];
      } else {
        $errors[] = 'Логин или пароль введены неверно';
      }
    } else {
      $errors[] = 'E-mail не подтвержден';
    }
  } else {
    $errors[] = 'Логин или пароль введены неверно';
  }
  $defaults['login'] = $input['login'];
  return array($input, $errors, $defaults);
}

function show_form($errors=false, $defaults=false) {
  include('templates/header.html');
  include('modules/sidebar/sidebar.php');
  print <<<_HTML1
  <div class="content">
    <div class="login__container">
      <form action="$_SERVER[REQUEST_URI]" class="auth__form" method="post">
        <div class="auth__login">
          <label class="auth__header" for="login">E-mail</label>
  _HTML1;
  if (isset($defaults['login'])) {
    print '<input id="login" name="login" type="text" class="auth__input" maxlength="100" required autocomplete="username" value="' . $defaults['login'] . '">';
  } else {
    print '<input id="login" name="login" type="text" class="auth__input" maxlength="100" required autocomplete="username">';
  }
  print <<<_HTML2
        </div>
        <div class="auth__password">
          <label class="auth__header" for="password">Пароль</label>
          <input id="password" name="password" type="password" class="auth__input" autocomplete="current-password" required>
        </div>
        <input type="submit" class="auth__submit" value="Войти">
        <a href="/register" class="auth__register"><span class="auth__register__text">Зарегистрироваться</span></a>
  _HTML2;

  if(is_array($errors) && $errors) {
    print '<ul class="auth__errors"><li class="auth__err">' . implode('</li><li class="auth__err">', $errors) . '</li></ul>';
  }

  print <<<_HTML3
        </form>
      </div>
    </div>
  _HTML3;
  include('templates/footer.html');
}

function process_form($input) {
  session_start();
  if (isset($input['is_admin']) && $input['is_admin']) {
    $_SESSION['is_admin'] = 1;
  }
  $_SESSION['nickname'] = $input['nickname'];
  $_SESSION['id'] = $input['id'];
  $_SESSION['avatar'] = $input['avatar'];
  header("Location: http://$_SERVER[HTTP_HOST]");
}
?>