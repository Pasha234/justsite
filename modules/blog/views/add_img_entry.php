<?php
require('../../../cloudinary_upload.php');
header('Content-Type: application/json');
if (isset($_COOKIE['PHPSESSID'])) {
  session_start();
  try {
    include("../../users/views/is_deleted.php");
    if (isset($result['deleted']) && $result['deleted'] == 1) {
      session_destroy();
      echo json_encode(array('success' => 0));
    }
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    throw new Exception("Error Processing Request", 0);
  }
} else {
  echo json_encode(array('success' => 0));
}

try{
  require('../../../db.php');
} catch(PDOException $e) {
  $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
  $handle = fopen('../../../log.txt', 'a');
  fwrite($handle, $err_text);
  fclose($handle);
  echo json_encode(array('success' => 0));
}

if ('POST' == $_SERVER['REQUEST_METHOD']) {
  // var_dump($_FILES);
  // if ($_FILES) {
  //   print "Response: ok";
  // }
  // exit;
  list($input, $errors, $defaults) = validate_form($db);
  if (!$errors) {
    process_form($db, $input);
  } else {
    echo json_encode(array('success' => 0, 'error' => $errors));
  }
} else {
  print "Что-то тут забыли?";
}

function validate_form($db) {
  $errors = [];
  $defaults = [];
  $input = [];
  if ($_FILES || (isset($_POST['text']) && str_replace(' ', '', $_POST['text']))){
    if (isset($_POST['text']) && str_replace(' ', '', $_POST['text'])) {
      $input['text'] = htmlentities($_POST['text']);
      $defaults['text'] = $_POST['text'];
    } else {
      $input['text'] = '';
    }
    if ($_FILES) {
      foreach($_FILES as $key => $file) {
        if ($file['size'] >= 20971520) {
          $errors[] = 'Файл слишком большой';
        } else if (!($file['type'] == 'image/png' || $file['type'] == 'image/jpeg')) {
          $errors[] = 'Неподдерживаемый тип файла';
        } else {
          $uploaddir = '../../../storage/img/';
          $file_name = uniqid('', true);
          if ($file['type'] == 'image/jpeg') {
            $uploadfile = $uploaddir . $file_name . '.jpg';
          } else if ($file['type'] == 'image/png') {
            $uploadfile = $uploaddir . $file_name . '.png';
          }
          if (move_uploaded_file($file['tmp_name'], $uploadfile)){
            $max_width = 1200;
            $max_height = 800;
            if ($file['type'] == 'image/jpeg') {
              $img = imagecreatefromjpeg($uploadfile);
              $w_src = imagesx($img);
              $h_src = imagesy($img);
              $max_ratio = $max_width / $max_height;
              $ratio = ($w_src / $h_src) / $max_ratio;
              if (($w_src > $max_width) && $ratio > 1) {
                $h_dest = $h_src * ($max_width / $w_src);
                $w_dest = $max_width;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else if (($h_src > $max_height) && $ratio < 1) {
                $w_dest = $w_src * ($max_height / $h_src);
                $h_dest = $max_height;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else if ($ratio == 1 && ($w_src > $max_width)) {
                $w_dest = $max_width;
                $h_dest = $max_height;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else {
                $w_dest = $w_src;
                $h_dest = $h_src;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              }
              imagecopyresampled($bg, $img, 0, 0, 0, 0, $w_dest, $h_dest, $w_src, $h_src);
              $quality = 50;
              imagejpeg($bg, $uploadfile, $quality);
              $result = uploadImage($uploadfile);
              unlink($uploadfile);
            } else if ($file['type'] == 'image/png') {
              $img = imagecreatefrompng($uploadfile);
              $w_src = imagesx($img);
              $h_src = imagesy($img);
              $max_ratio = $max_width / $max_height;
              $ratio = ($w_src / $h_src) / $max_ratio;
              if (($w_src > $max_width) && $ratio > 1) {
                $h_dest = $h_src * ($max_width / $w_src);
                $w_dest = $max_width;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else if (($h_src > $max_height) && $ratio < 1) {
                $w_dest = $w_src * ($max_height / $h_src);
                $h_dest = $max_height;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else if ($ratio == 1 && ($w_src > $max_width)) {
                $w_dest = $max_width;
                $h_dest = $max_height;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              } else {
                $w_dest = $w_src;
                $h_dest = $h_src;
                $bg = imagecreatetruecolor($w_dest, $h_dest);
              }
              imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
              imagealphablending($bg, TRUE);
              imagecopyresampled($bg, $img, 0, 0, 0, 0, $w_dest, $h_dest, $w_src, $h_src);
              $quality = 50;
              imagejpeg($bg, $uploaddir . $file_name . '.jpg', $quality);
              $result = uploadImage($uploaddir . $file_name . '.jpg');
              unlink($uploaddir . $file_name . '.jpg');
              unlink($uploadfile);
            }
            if (isset($result['url'])) {
              $input['file'][$key] = $result['url'];
            } else {
              $errors[] = 'Не удалось загрузить картинку';
            }
          } else {
            $errors[] = 'Не удалось прочитать файл';
          }
      }
      }
      
    } else {
      $input['file'] = '';
    }
  } else {
    $errors[] = 'Пустой пост';
  }
  return array($input, $errors, $defaults);
}

function process_form($db, $input) {
  try{
    $stmt = $db->prepare('INSERT INTO entries (user_id, text) VALUES (?, ?)');
    $stmt->execute(array($_SESSION['id'], $input['text']));
    if ($input['file']) {
      $checkReq = $db->prepare('SELECT id FROM entries WHERE user_id=? ORDER BY add_time DESC LIMIT 1');
      $checkReq->execute(array($_SESSION['id']));
      $entry_id = $checkReq->fetch()['id'];
      $stmt2 = $db->prepare('INSERT INTO entries_img (entry_id, img_link, img_order) VALUES (?, ?, ?)');
      foreach ($input['file'] as $key => $file) {
        $stmt2->execute(array($entry_id, $file, ($key + 1)));
      }
    }
    echo json_encode(array('success' => 1));
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('../../../log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    echo json_encode(array('success' => 0));
  }
}

?>