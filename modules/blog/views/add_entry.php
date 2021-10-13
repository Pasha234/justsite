<?php
# Cookie validation
if (isset($_COOKIE['PHPSESSID'])) {
  session_start();
  try {
    include("modules/users/views/is_deleted.php");
    if (isset($result['deleted']) && $result['deleted'] == 1) {
      session_destroy();
      print '<script src="/staticfiles/js/delete_phpsessid.js"></script>';
    }
  } catch (PDOException $e) {
    $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
    $handle = fopen('log.txt', 'a');
    fwrite($handle, $err_text);
    fclose($handle);
    throw new Exception("Error Processing Request", 0);
  }
} else {
  header("Location: http://$_SERVER[HTTP_HOST]/login");
}

# connection to the database
try{
  require('db.php');
} catch(PDOException $e) {
  $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
  $handle = fopen('log.txt', 'a');
  fwrite($handle, $err_text);
  fclose($handle);
  throw new Exception("Error Processing Request", 0);
}

# HTML
include('templates/header.html');
include('modules/sidebar/sidebar.php');
print <<<_HTML
<div class="content">
  <form action="$_SERVER[REQUEST_URI]" method="POST" class="add__form" enctype="multipart/form-data">
    <h2 class="add__header">Описание</h2>
    <textarea name="text" id="add__text" cols="30" rows="10" class="add__textarea" placeholder="Введите текст (можно оставить пустым)"></textarea>
    <label id="add-drop-area" for="postImg" style="display: none;">
      <p>Загрузите изображения с помощью диалога выбора файлов или перетащив нужные изображения в выделенную область <small>(Максимальный размер файла 20 МБ и максимум файлов - 5)</small></p>
      <input name="file" type="file" id="postImg" accept="image/*" onchange="handleInput(this.files)" multiple>
    </label>
    <div class="gallery" style="display: none;">
    </div>
    <span class="add__img__cancel" data-drop_area_cancel="true" style="display: none;">Отмена</span>
    <button id="add-img-button" type="button" class="add__img" data-add_image="true">Добавить картинку <img src="/staticfiles/img/landscape.png" alt="" data-add_image="true"></button>
    <button type="submit" class="add__submit">Добавить запись</button>
  </form>
</div>
<script src="/staticfiles/js/add_img_entry.js"></script>
_HTML;
include('templates/footer.html');