const confirmListener = (event) => {
  if (event.target.dataset.user_exit) {
    const $modal = modal({
      is_post: false,
      title: 'Вы действительно хотите выйти?',
      body: '<div class="avatar__change__buttons"><div class="avatar__change__submit" data-exit_submit="true"></div><div class="avatar__change__cancel" data-exit_cancel="true"></div></div>',
      beforeClose: function () {
        document.addEventListener('click', confirmListener)
        document.removeEventListener('click', exitListener)
      },
      noCross: true
    })
    $modal.open()
    $('.modal__window').css('min-height', 'unset')
    document.removeEventListener('click', confirmListener)
    document.addEventListener('click', (event) => exitListener(event, $modal))
  }
}


const exitListener = (event, $modal) => {
  if (event.target.dataset.exit_submit) {
    $.ajax({
      type: 'POST',
      url: '/modules/registration/views/logout.php',
      data: {'exit': 1},
      success: function(response) {
        jsonData = JSON.parse(response)
        if (jsonData.success == 1) {
          document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00   UTC;path=/;host=localhost";
          window.location.href = 'http://' + window.location.hostname
        } else {
          $('.modal__window').css('min-height', '100vh')
          $modal.close()
          document.addEventListener('click', confirmListener)
          document.removeEventListener('click', exitListener)
          $('.error__message').remove()
          errorMessage('Произошла ошибка', '.personal__avatar__change')
        }
      },
      error: function() {
        $('.modal__window').css('min-height', '100vh')
        $modal.close()
        document.addEventListener('click', confirmListener)
        document.removeEventListener('click', exitListener)
        $('.error__message').remove()
        errorMessage('Произошла ошибка', '.personal__avatar__change')
      }
    })
  } else if (event.target.dataset.exit_cancel) {
    $('.modal__window').css('min-height', '100vh')
    $modal.close()
    document.addEventListener('click', confirmListener)
    document.removeEventListener('click', exitListener)
  }
}

document.addEventListener('click', confirmListener)