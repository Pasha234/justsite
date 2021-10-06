<?php
require($_SERVER['DOCUMENT_ROOT'] . '/db.php');
$stmt = $db->prepare('SELECT deleted FROM users WHERE id=?');
$stmt->execute(array($_SESSION['id']));
$result = $stmt->fetch();
?>