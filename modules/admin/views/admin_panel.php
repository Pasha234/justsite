<?php
if (!isset($_COOKIE['PHPSESSID'])) {
  header("Location: http://$_SERVER[HTTP_HOST]");
} else {
  session_start();
}
if (!(isset($_SESSION['is_admin']) && $_SESSION['is_admin'] == 1)) {
  header("Location: http://$_SERVER[HTTP_HOST]");
}
include('templates/header.html');
include('modules/sidebar/sidebar.php');
print <<<_HTML
<div class="content">
  <div class="admin__container">
    <h2 class="admin__header">Админ-панель</h2>
    <div class="admin__user">
_HTML;
if (isset($_SESSION['avatar'])) {
  $Headers = @get_headers($_SESSION['avatar']);
  if(strpos($Headers[0], '200')){
    print '<img src="' . $_SESSION['avatar'] . '" alt="" class="admin__logo">';
  } else {
    print '<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="admin__logo">';
  }
} else {
  print '<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="admin__logo">';
}
print <<<_HTML
      <span class="admin__name" id="name">$_SESSION[nickname]</span>
    </div>
    <span class="admin__avatar__change" data-change_avatar="true">Сменить аватар</span>
    <div class="admin__panel">
      <a href="http://$_SERVER[HTTP_HOST]/admin/users"><div class="admin__panel__item"><span class="name">Пользователи</span></div></a>
      <a href="http://$_SERVER[HTTP_HOST]/admin/entries"><div class="admin__panel__item"><span class="name">Записи</span></div></a>
    </div>
    <button class="admin__quit" data-user_exit="true">Выйти</button>
  </div>
</div>
<script src="staticfiles/js/modal.js"></script>
<script src="staticfiles/js/change_avatar.js"></script>
<script src="staticfiles/js/logout.js"></script>
_HTML;
include('templates/footer.html');
?>