<?php
if (isset($_COOKIE['PHPSESSID'])) {
  session_start();
}
include('templates/header.html');
include('modules/sidebar/sidebar.php');
print <<<_HTML
<div class="content">
  <div class="about__container">
    <h2 class="about__support">Здесь ничего интересного</h2>
    <button id="dont_click" class="about__dont" data-dont="true">Не кликай</button>
    <p id="dont_text">Написано-же не кликай</p>
    <button id="okay_click">Кликай</button>
  </div>
</div>
<script src="/staticfiles/js/about.js"></script>
_HTML;
include('templates/footer.html');
?>