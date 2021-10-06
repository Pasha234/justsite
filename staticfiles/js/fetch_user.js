const id = /\/\d+/.exec(window.location.pathname)[0].replace(/\//, '')
$(document).ready(function() {
  $.ajax({
    url: '/modules/users/views/fetch_user.php',
    method: 'GET',
    data: {user: id},
    success: function(response) {
      if (response.success === 1) {
        let userHTML = `
        <div class="users__user">
        `
        if (response.user.deleted === 1) {
          userHTML += `
            <img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">
            <span class="user__name" id="name">Пользователь удален</span>
          </div>
          `
        } else {
          if (response.user.avatar) {
            userHTML += `<img src="${response.user.avatar}" alt="" class="user__logo">`
          } else {
            userHTML += `<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">`
          }
          userHTML += `
            <div class="user__name"><span id="name">${response.user.nickname}</span>
          `
          if (response.user.is_admin == 1) {
            userHTML += `<img id="crown" src="/staticfiles/img/crown.png" alt="" title="Администратор сайта">
            `
          }
          userHTML += `
            </div>
          </div>
          `
        }
        $('.users__container').append($(userHTML))
      } else if (response.error) {
        errorMessage(response.error, '.users__container', 'inside')
      } else {
        errorMessage('Произошла ошибка', '.users__container', 'inside')
      }
    },
    error: function() {
      errorMessage('Произошла ошибка', '.users__container', 'inside')
    }
  })
})