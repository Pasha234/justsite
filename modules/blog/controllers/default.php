<?php
function action_index() {
  include('modules/blog/views/index.php');
}

function action_add_entry() {
  include('modules/blog/views/add_entry.php');
}

function action_about() {
  if (isset($_COOKIE['PHPSESSID'])) {
    session_start();
  }
  include('templates/header.html');
  include('modules/sidebar/sidebar.php');
  include('templates/about.html');
  include('templates/footer.html');
}
?>