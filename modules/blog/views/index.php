<?php
if (isset($_COOKIE['PHPSESSID'])) {
  session_start();
}
include('templates/header.html');
include('modules/sidebar/sidebar.php');
print '<div class="content">';
print '<div class="content__add"><a href="/add_entry" class="add__link"><span class="add__plus">+</span></a></div>';
try{
  print <<<_HTML
    <div data-load_more="true" id="more_posts" style="display: none"><span data-load_more="true">Загрузить больше</span></div>
  </div>
  <script src="/staticfiles/js/modal.js"></script>
  <script src="/staticfiles/js/index.js"></script>
  <script src="/staticfiles/js/load_posts.js"></script>
  _HTML;
} catch(PDOException $e){
  $err_text = date("F j, Y, H:i") . PHP_EOL . $e . PHP_EOL;
  $handle = fopen('log.txt', 'a');
  fwrite($handle, $err_text);
  fclose($handle);
  throw new Exception("Error Processing Request", 0);
}
include('templates/footer.html');
?>