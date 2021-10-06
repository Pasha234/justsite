const id = /\/\d+/.exec(window.location.pathname)[0].replace(/\//, '')
$(document).ready(function() {
  $.ajax({
    url: '/modules/admin/views/fetch.php',
    method: 'GET',
    data: {user: id},
    success: function(response) {
      if (response.success === 1) {
        let userHTML = `
        <div class="admin__user">
        `
        if (response.user.avatar) {
          userHTML += `<img src="${response.user.avatar}" alt="" class="user__logo">`
        } else {
          userHTML += `<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">`
        }
        if (response.user.deleted === 1) {
          userHTML += `
            <span class="user__name" id="name">${response.user.nickname} (Удален)</span>
          </div>
          <button class="admin__user__restore" data-user_restore="true">Восстановить</button>
          `
        } else {
          userHTML += `
            <span class="user__name" id="name">${response.user.nickname}</span>
          </div>
          <button class="admin__user__delete" data-user_delete="true">Удалить</button>
          `
        }
        userHTML += `
        <h2 class="admin__user__header">Сведения о пользователе</h2>
        <div class="admin__user__info__item" id="id_item"><span class="admin__user__info__text">Id: ${response.user.id}</span></div>
        <div class="admin__user__info__item" id="email_item"><span class="admin__user__info__text">Email: ${response.user.email}</span></div>
        <div class="admin__user__info__item" id="hash_item"><span class="admin__user__info__text">Hash: ${response.user.hash}</span></div>
        <div class="admin__user__info__item" id="regtime_item"><span class="admin__user__info__text">Дата регистрации: ${response.user.reg_time}</span></div>
        <div class="admin__user__changes">
          <span class="admin__user__info__item">Лимит смены имени:</span>
          <input id="changes_number" type="number" value="${response.user.nickname_changes}" min="0" max="100" onchange="changeListener(${response.user.nickname_changes})"><button id="changes_button" type="button" data-name_changes="true" style="display: none">Изменить</button>
        </div>
        <div class="admin__user__entries">
          <h2 id="header">Записи</h2>
        </div>`
        // <img data-copy_id="true" src="/staticfiles/img/copy.png" alt="" title="скопировать"><div class="info__item__copy">Скопировано в буфер обмена</div>
        $('.admin__user__container').append($(userHTML))
        if (response.user.deleted === 0) {
          $(document).click(function(e) {
            if(e.target.dataset.user_delete) {
              $modal = modal({
                is_post: false,
                title: 'Вы действительно хотите удалить пользователя?',
                body: '<div class="avatar__change__buttons"><div class="avatar__change__submit" data-delete_submit="true"></div><div class="avatar__change__cancel" data-delete_cancel="true"></div></div>',
                beforeClose: function () {
                  $(document).off('click', deleteListener)
                },
                noCross: true
              })
              $modal.open()
              $(document).on('click', deleteListener)
              function deleteListener(e) {
                if (e.target.dataset.delete_submit) {
                  $.ajax({
                    url: "/modules/admin/views/user_change.php",
                    method: "POST",
                    data: {delete: 1, user: response.user.id},
                    success: function(response) {
                      if (response.success === 1) {
                        history.back()
                        window.location.href = window.location.origin + window.location.pathname
                      } else if (response.error) {
                        $modal.close()
                        $(document).off('click', deleteListener)
                        $('.error__message').remove()
                        errorMessage(response.error, '.admin__user__delete')
                      } else {
                        $modal.close()
                        $(document).off('click', deleteListener)
                        $('.error__message').remove()
                        errorMessage('Произошла ошибка', '.admin__user__delete')
                      }
                    },
                    error: function() {
                      $modal.close()
                      $(document).off('click', deleteListener)
                      $('.error__message').remove()
                      errorMessage('Произошла ошибка', '.admin__user__delete')
                    }
                  })
                } else if (e.target.dataset.delete_cancel) {
                  $modal.close()
                  $(document).off('click', deleteListener)
                }
              }
            }
          })
        } else {
          $(document).click(function(e) {
            if(e.target.dataset.user_restore) {
              $modal = modal({
                is_post: false,
                title: 'Вы действительно хотите восстановить пользователя?',
                body: '<div class="avatar__change__buttons"><div class="avatar__change__submit" data-restore_submit="true"></div><div class="avatar__change__cancel" data-restore_cancel="true"></div></div>',
                beforeClose: function () {
                  $(document).off('click', restoreListener)
                },
                noCross: true
              })
              $modal.open()
              $(document).on('click', restoreListener)
              function restoreListener(e) {
                if (e.target.dataset.restore_submit) {
                  $.ajax({
                    url: "/modules/admin/views/user_change.php",
                    method: "POST",
                    data: {restore: 1, user: response.user.id},
                    success: function(response) {
                      if (response.success === 1) {
                        history.back()
                        window.location.href = window.location.origin + window.location.pathname
                      } else if (response.error) {
                        $modal.close()
                        $(document).off('click', restoreListener)
                        $('.error__message').remove()
                        errorMessage(response.error, '.admin__user__restore')
                      } else {
                        $modal.close()
                        $(document).off('click', restoreListener)
                        $('.error__message').remove()
                        errorMessage('Произошла ошибка', '.admin__user__restore')
                      }
                    },
                    error: function() {
                      $modal.close()
                      $(document).off('click', restoreListener)
                      $('.error__message').remove()
                      errorMessage('Произошла ошибка', '.admin__user__restore')
                    }
                  })
                } else if (e.target.dataset.restore_cancel) {
                  $modal.close()
                  $(document).off('click', restoreListener)
                }
              }
            }
          })
        }
        // $(document).click(function(e) {
        //   if (e.target.dataset.copy_id) {
        //     console.log('Yahoo');
        //     navigator.clipboard.writeText(response.user.id).then(function() {
        //       $('#item_id').append('<div class="info__item__copy">Скопировано в буфер обмена</div>')
        //     });
        //   } else if (e.target.dataset.copy_email) {
        //     navigator.clipboard.writeText(response.user.email).then(function() {
        //       $('#email_id').append('<div class="info__item__copy">Скопировано в буфер обмена</div>')
        //     });
        //   } else if (e.target.dataset.copy_hash) {
        //     navigator.clipboard.writeText(response.user.hash).then(function() {
        //       $('#hash_id').append('<div class="info__item__copy">Скопировано в буфер обмена</div>')
        //     });
        //   }
        // })
        $.ajax({
          url: '/modules/admin/views/load_user_posts.php',
          method: 'GET',
          data: {user: response.user.id},
          success: function(response) {
            if (response.success === 1) {
              for (postKey in response.posts){
                const post = response.posts[postKey]
                let text = ''
                if (post.text.length > 40) {
                  text = post.text.substr(0, 40)
                  text += '...'
                } else {
                  if (post.text) {
                    text = post.text
                  } else {
                    text = 'Без текста'
                  }
                }
                if (post.deleted) {
                  text += ' (Удалено)'
                }
                $('.admin__user__entries').append($(`<a href="/admin/entries/${post.id}"><div class="user__entry"><span class="id">${post.id}</span><span class="name">${text}</span></div></a>`))
              }
            } else {
              $('.error__message').remove()
              errorMessage('Не удалось загрузить записи пользователя', '#header')
            }
          },
          error: function() {
            $('.error__message').remove()
            errorMessage('Не удалось загрузить записи пользователя', '#header')
          }
        })
        $(document).click(function (e){
          if(e.target.dataset.name_changes) {
            $.ajax({
              url: "/modules/admin/views/user_change.php",
              method: "POST",
              data: {nickname_changes: $("#changes_number").val(), user: response.user.id},
              success: function(response) {
                if (response.success == 1) {
                  window.location.href = window.location.origin + window.location.pathname
                } else if (response.error) {
                  $('.error__message').remove()
                  errorMessage(response.error, '.admin__user__changes')
                } else {
                  $('.error__message').remove()
                  errorMessage("Произошла ошибка", '.admin__user__changes')
                }
              },
              error: function() {
                $('.error__message').remove()
                errorMessage("Произошла ошибка", '.admin__user__changes')
              }
            })
          }
        })
      } else if (response.error) {
        $('.error__message').remove()
        errorMessage(response.error, '.admin__user__container', 'inside')
      } else {
        $('.error__message').remove()
        errorMessage('Произошла ошибка', '.admin__user__container', 'inside')
      }
    },
    error: function() {
      $('.error__message').remove()
      errorMessage('Произошла ошибка', '.admin__user__container', 'inside')
    }
  })
})

function changeListener(nickname_changes) {
  if ($('#changes_number').val() != nickname_changes) {
    $('#changes_button').css('display', 'inline-block')
  } else {
    $('#changes_button').css('display', 'none')
  }
}