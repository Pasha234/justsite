$(document).ready(function () {
  $(".sidebar__burger").click(function () {
    sidebar = $(".sidebar")
    sidebar.addClass('animate__fadeOutLeftBig')
    setTimeout(() => {
      sidebar.removeClass('animate__fadeOutLeftBig')
      sidebar.addClass('animate__fadeInLeftBig')
      sidebar.toggleClass('open')
      setTimeout(() => {
        sidebar.removeClass('animate__fadeInLeftBig')
      }, 1000);
    }, 200);
  })
})