<?php
if (isset($_COOKIE['PHPSESSID'])) {
  session_start();
}
include('templates/header.html');
include('modules/sidebar/sidebar.php');
print <<<_HTML
<div class="content">
  <div class="users__container">
  </div>
</div>
<script src="/staticfiles/js/modal.js"></script>
<script src="/staticfiles/js/fetch_user.js"></script>
_HTML;
include('templates/footer.html');
?>