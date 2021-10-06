<?php
if (!isset($_COOKIE['PHPSESSID'])) {
  header("Location: http://$_SERVER[HTTP_HOST]/login");
} else {
  session_start();
}

include('templates/header.html');
include('modules/sidebar/sidebar.php');
print <<<_HTML
<div class="content">
  <div class="personal__container">
    <div class="personal__user">
_HTML;
if (isset($_SESSION['avatar'])) {
  $Headers = @get_headers($_SESSION['avatar']);
  if(strpos($Headers[0], '200')){
    print '<img src="' . $_SESSION['avatar'] . '" alt="" class="user__logo">';
  } else {
    print '<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">';
  }
} else {
  print '<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">';
}
      
print <<<_HTML2
      <span class="user__name" id="name">$_SESSION[nickname]</span>
      <div class="user__name__change"><img src="/staticfiles/img/pen.png" alt="" data-change_name="true"></div>
    </div>
    <span class="personal__avatar__change" data-change_avatar="true">Сменить аватар</span>
    <button class="personal__quit" data-user_exit="true">Выйти</button>
  </div>
</div>
<script src="/staticfiles/js/modal.js"></script>
<script src="/staticfiles/js/change_name.js"></script>
<script src="/staticfiles/js/change_avatar.js"></script>
<script src="/staticfiles/js/logout.js"></script>
_HTML2;
include('templates/footer.html');
?>