<aside class="animate__animated sidebar">
  <div class="sidebar__burger"><span></span></div>
  <div class="logo">JustSite</div>
  <?php
  print '<div class="user__container">';
  if (!isset($_COOKIE['PHPSESSID'])) {
    print '<a href="/login" class="user"><span class="user__link">Войти</span></a></div>';
  } else {
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']) {
      print '<a href="/admin" class="user"><img src="';
    } else {
      print '<a href="/personal" class="user"><img src="';
    }
    if (isset($_SESSION['avatar'])) {
      $Headers = @get_headers($_SESSION['avatar']);
      if(strpos($Headers[0], '200')){
        print $_SESSION['avatar'];
      } else {
        print '/staticfiles/img/no-user-image-icon.jpg';
      }
    } else {
      print '/staticfiles/img/no-user-image-icon.jpg';
    }
    if (isset($_SESSION['nickname'])) {
      if (strlen($_SESSION['nickname']) > 12) {
        $nickname = mb_substr($_SESSION['nickname'], 0, 10);
        $nickname .= '...';
      } else {
        $nickname = $_SESSION['nickname'];
      }
      print '" alt="" class="user__logo"><span class="user__link">' . $nickname . '</span></a></div>';
    } else {
      print '" alt="" class="user__logo"><span class="user__link">' . 'Noname' . '</span></a></div>';
    }
  }
  
  ?>
  <nav class="navigate">
    <ul class="nav__list">
      <li class="nav__item"><a href="/" class="nav__link" id="nav__item__news">Новости</a></li>
      <li class="nav__item"><a href="/about" class="nav__link" id="nav__item__about">Об авторе</a></li>
    </ul>
  </nav>
</aside>