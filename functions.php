<?php
function get_modules(){
  return preg_split('/\s*,\s*/', MODULES);
}
function get_request_path() {
  return trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
}

function get_modules_rules(){
  $rules = array();
  foreach (get_modules() as $module){
    $rules = array_merge($rules, require_once(MODULES_PATH . '/' . $module . '/routes.php'));
  }
  return $rules;
}

function clear_numberic_matches($matches) {
  $clean = array();
  foreach ($matches as $key=>$value){
    if (!is_int($key)) {
      $clean[$key] = $value;
    }
  }
  return $clean;
}
?>