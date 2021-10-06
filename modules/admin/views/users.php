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
    <h2 class="admin__header">Пользователи</h2>
    <div class="admin__panel">
    </div>
  </div>
</div>
<script src="/staticfiles/js/admin_fetch_users.js"></script>
_HTML;
include('templates/footer.html');
?>