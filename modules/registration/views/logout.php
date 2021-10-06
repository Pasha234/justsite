<?php
if (isset($_COOKIE['PHPSESSID'])){
  session_start();
} else {
  echo json_encode(array('success' => 0));
}
if (isset($_POST['exit']) && $_POST['exit'] == 1) {
  session_destroy();
  echo json_encode(array('success' => 1));
} else {
  echo json_encode(array('success' => 0));
}
?>