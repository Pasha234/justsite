<?php
function action_admin_panel() {
  require('modules/admin/views/admin_panel.php');
}

function action_users() {
  require('modules/admin/views/users.php');
}

function action_user() {
  require('modules/admin/views/user.php');
}

function action_entries() {
  require('modules/admin/views/entries.php');
}

function action_entry() {
  require('modules/admin/views/entry.php');
}
?>