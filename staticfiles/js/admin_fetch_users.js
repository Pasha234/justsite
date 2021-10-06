$(document).ready(function() {
  $.ajax({
    url: '../modules/admin/views/fetch.php',
    type: 'GET',
    data: {users: 1},
    success: function(response) {
      if (response.success === 1) {
        for (let userKey in response.users) {
          const user = response.users[userKey]
          let nickname = ''
          if (user.deleted === 1) {
            nickname += user.nickname + ' (Удален)'
          } else {
            nickname += user.nickname
          }
          const userHTML = `<a href="/admin/users/${user.id}"><div class="admin__panel__item"><span class="id">${user.id}</span><span class="name">${nickname}</span></div></a>`
          $('.admin__panel').append($(userHTML))
        }
      } else if(response.error){
        errorMessage(response.error, 'admin__container', 'inside')
      } else {
        errorMessage('Произошла ошибка', 'admin__container', 'inside')
      }
    },
    error: function() {
      errorMessage('Произошла ошибка', 'admin__container', 'inside')
    }
  })
})
