<?php
require_once('config.php');
require_once('functions.php');

$module = 'blog';
$controller = 'default';
$action = 'index';

$path = get_request_path();
$rules = get_modules_rules();

foreach ($rules as $pattern=>$route) {
  if (preg_match('/^' . ltrim($pattern, '/') . '$/m', $path, $matches)) {
    list($module, $controller, $action) = explode('/', $route);
    $_GET = array_merge($_GET, clear_numberic_matches($matches));
    break;
  }
}

require_once(MODULES_PATH . '/' . $module . '/controllers/' . $controller . '.php');
call_user_func('action_' . $action);
?>