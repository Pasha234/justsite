<?php
require('../../../cloudinary_upload.php');
if (isset($_COOKIE['PHPSESSID'])){
  session_start();
} else {
  echo json_encode(array('success' => 0));
  exit;
}
// Удаление картинки из папки
if (isset($_POST['delete']) && $_POST['delete'] == 1) {
  if (isset($_SESSION['new_avatar'])) {
    if ($_SESSION['new_avatar_type'] == 'image/png') {
      unlink('../../../storage/img/' . $_SESSION['new_avatar'] . '.png');
    } else {
      unlink('../../../storage/img/' . $_SESSION['new_avatar'] . '.jpg');
    }
    unset($_SESSION['new_avatar']);
    echo json_encode(array('success' => 1));
  }
  exit;
}
// Обработка запроса на изменение аватара
if (isset($_POST['change']) && $_POST['change'] == 1) {
  try{
    require('../../../db.php');
    $stmt = $db->prepare('UPDATE users SET avatar = ? WHERE id = ?');
    if (isset($_SESSION['avatar']) && $_SESSION['avatar']) {
      // $Headers = @get_headers($_SESSION['avatar']);
      // if(strpos($Headers[0], '200')){
        deleteImage($_SESSION['avatar']);
      // }
    }
    
    $max_height = 400;
    $max_width = 400;
    $uploaddir = '../../../storage/img/';
    if (isset($_SESSION['new_avatar_type']) && $_SESSION['new_avatar_type'] == 'image/png') {
      $img = imagecreatefrompng($uploaddir . $_SESSION['new_avatar'] . '.png');
      $w_src = imagesx($img);
      $h_src = imagesy($img);
      if ($w_src > $h_src) {
        $img = imagecrop($img, array('x' => round(($w_src - $h_src) / 2), 'y' => 0, 'width' => $h_src, 'height' => $h_src));
      } else if ($h_src > $w_src) {
        $img = imagecrop($img, array('x' => 0, 'y' => round(($h_src - $w_src) / 2), 'width' => $w_src, 'height' => $w_src));
      }
      if ($w_src > $max_width) {
        $bg = imagecreatetruecolor($max_width, $max_height);
        imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
        imagealphablending($bg, TRUE);
        imagecopyresampled($bg, $img, 0, 0, 0, 0, $max_width, $max_height, imagesx($img), imagesy($img));
      } else {
        $bg = imagecreatetruecolor(imagesx($img), imagesy($img));
        imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
        imagealphablending($bg, TRUE);
        imagecopy($bg, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
      }
      $quality = 50;
      imagejpeg($bg, $uploaddir . $_SESSION['new_avatar'] . '.jpg', $quality);
      $result = uploadImage($uploaddir . $_SESSION['new_avatar'] . '.jpg');
      $stmt->execute(array($result['url'], $_SESSION['id']));
      unlink($uploaddir . $_SESSION['new_avatar'] . '.png');
      unlink($uploaddir . $_SESSION['new_avatar'] . '.jpg');
    } else if (isset($_SESSION['new_avatar_type']) && $_SESSION['new_avatar_type'] == 'image/jpeg') {
      $img = imagecreatefromjpeg($uploaddir . $_SESSION['new_avatar'] . '.jpg');
      $w_src = imagesx($img);
      $h_src = imagesy($img);
      if ($w_src > $h_src) {
        $img = imagecrop($img, array('x' => round(($w_src - $h_src) / 2), 'y' => 0, 'width' => $h_src, 'height' => $h_src));
      } else if ($h_src > $w_src) {
        $img = imagecrop($img, array('x' => 0, 'y' => round(($h_src - $w_src) / 2), 'width' => $w_src, 'height' => $w_src));
      }
      if ($w_src > $max_width) {
        $bg = imagecreatetruecolor($max_width, $max_width);
        imagecopyresampled($bg, $img, 0, 0, 0, 0, $max_width, $max_height, imagesx($img), imagesy($img));
      } else {
        $bg = imagecreatetruecolor(imagesx($img), imagesy($img));
        imagecopy($bg, $img, 0, 0, 0, 0, imagesx($img), imagesy($img));
      }
      $quality = 50;
      imagejpeg($bg, $uploaddir . $_SESSION['new_avatar'] . '.jpg', $quality);
      $result = uploadImage($uploaddir . $_SESSION['new_avatar'] . '.jpg');
      $stmt->execute(array($result['url'], $_SESSION['id']));
      unlink($uploaddir . $_SESSION['new_avatar'] . '.jpg');
    }
    $_SESSION['avatar'] = $result['url'];
    unset($_SESSION['new_avatar']);
    unset($_SESSION['new_avatar_type']);
    echo json_encode(array('success' => 1));
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Ошибка подключения к базе данных'));
  }
} else if (isset($_FILES['file']) && $_FILES['file']) {
  try{
    require('../../../db.php');
    if (isset($_SESSION['new_avatar'])) {
      if (file_exists('../../../storage/img/' . $_SESSION['new_avatar'])) {
        unlink('../../../storage/img/' . $_SESSION['new_avatar']);
      }
      unset($_SESSION['new_avatar']);
    }
    if ($_FILES['file']['size'] >= 20971520) {
      echo json_encode(array('success' => 0, 'error' => 'Файл слишком большой'));
      exit;
    }
    if (!($_FILES['file']['type'] == 'image/png' || $_FILES['file']['type'] == 'image/jpeg')) {
      echo json_encode(array('success' => 0, 'error' => 'Неверный тип файла'));
      exit;
    }
    $uploaddir = '../../../storage/img/';
    $file_name = uniqid('', true);
    if ($_FILES['file']['type'] == 'image/jpeg') {
      $uploadfile = $uploaddir . $file_name . '.jpg';
      $_SESSION['new_avatar'] = $file_name;
    } else if ($_FILES['file']['type'] == 'image/png') {
      $uploadfile = $uploaddir . $file_name . '.png';
      $_SESSION['new_avatar'] = $file_name;
    }
    $_SESSION['new_avatar_type'] = $_FILES['file']['type'];
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)){
      echo json_encode(array('success' => 1));
    } else {
      echo json_encode(array('success' => 0, 'error' => 'Ошибка, связанная с файлом'));
    }
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0, 'error' => 'Ошибка подключения к базе данных'));
  }
} else {
  echo json_encode(array('success' => 0, 'error' => 'Файл не выбран'));
}
?>