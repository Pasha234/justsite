const id = /\/\d+/.exec(window.location.pathname)[0].replace(/\//, '')
$(document).ready(function() {
  $.ajax({
    url: '/modules/admin/views/fetch.php',
    method: 'GET',
    data: {entry: id},
    success: function(response) {
      if (response.success === 1) {
        let text = ''
        if (response.entry.text) {
          text = response.entry.text
        } else {
          text = 'Без текста'
        }
        let entryHTML = ``
        if (response.entry.deleted === 0) {
          entryHTML += `<h2 class="admin__entry__header">Запись номер ${response.entry.id}</h2>`
        } else {
          entryHTML += `<h2 class="admin__entry__header">Запись номер ${response.entry.id} (Удалено)</h2>`
        }
        entryHTML += `
        <span>Автор:</span>
        <a id="link" href="/admin/users/${response.entry.user_id}"><div id="author"><span class="id"></span><span class="name"></span></div></a>
        <span>Текст:</span>
        <div class="entry__text"><p>${text}</p></div>
        <span>Изображение:</span>
        `
        if (response.entry.img) {
          entryHTML += `<div class="entry__img"><a href="${response.entry.img}"><img src="${response.entry.img}" alt=""></a></div>`;
        } else {
          entryHTML += '<div class="entry__img">Нет изображения</div>'
        }
        if (response.entry.deleted === 1) {
          entryHTML += `
          <button class="admin__entry__restore" data-entry_restore="true">Восстановить</button>
          `
        } else {
          entryHTML += `
          <button class="admin__entry__delete" data-entry_delete="true">Удалить</button>
          `
        }
        $('.admin__entry__container').append($(entryHTML))
        $.ajax({
          url: '/modules/admin/views/fetch.php',
          method: 'GET',
          data: {user: response.entry.user_id},
          success: function (response) {
            if (response.success === 1) {
              $('#author .id').html(response.user.id)
              if (response.user.deleted === 1) {
                $('#author .name').html(response.user.nickname + ' (Удален)')
              } else {
                $('#author .name').html(response.user.nickname)
              }
            } else if (response.error) {
              $('#author .name').html('Нет данных')
              errorMessage(response.error, '#link')
            } else {
              $('#author .name').html('Нет данных')
              errorMessage('Не удалось загрузить данные об авторе', '#link')
            }
          },
          error: function (){
            $('#author .name').html('Нет данных')
            errorMessage('Не удалось загрузить данные об авторе', '#link')
          }
        })
        if (response.entry.deleted === 0) {
          $(document).click(function(e) {
            if(e.target.dataset.entry_delete) {
              $modal = modal({
                is_post: false,
                title: 'Вы действительно хотите удалить запись?',
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
                    url: "/modules/admin/views/entry_change.php",
                    method: "POST",
                    data: {delete: 1, entry: response.entry.id},
                    success: function(response) {
                      if (response.success === 1) {
                        history.back()
                        window.location.href = window.location.origin + window.location.pathname
                      } else if (response.error) {
                        $modal.close()
                        $(document).off('click', deleteListener)
                        errorMessage(response.error, '.admin__entry__delete')
                      } else {
                        $modal.close()
                        $(document).off('click', deleteListener)
                        errorMessage('Произошла ошибка', '.admin__entry__delete')
                      }
                    },
                    error: function() {
                      $modal.close()
                      $(document).off('click', deleteListener)
                      errorMessage('Произошла ошибка', '.admin__entry__delete')
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
            if(e.target.dataset.entry_restore) {
              $modal = modal({
                is_post: false,
                title: 'Вы действительно хотите восстановить запись?',
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
                    url: "/modules/admin/views/entry_change.php",
                    method: "POST",
                    data: {restore: 1, entry: response.entry.id},
                    success: function(response) {
                      if (response.success === 1) {
                        history.back()
                        window.location.href = window.location.origin + window.location.pathname
                      } else if (response.error) {
                        $modal.close()
                        $(document).off('click', restoreListener)
                        errorMessage(response.error, '.admin__entry__restore')
                      } else {
                        $modal.close()
                        $(document).off('click', restoreListener)
                        errorMessage('Произошла ошибка', '.admin__entry__restore')
                      }
                    },
                    error: function() {
                      $modal.close()
                      $(document).off('click', restoreListener)
                      errorMessage('Произошла ошибка', '.admin__entry__restore')
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
      } else if (response.error) {
        errorMessage(response.error, '.admin__entry__container', 'inside')
      } else {
        errorMessage('Произошла ошибка', '.admin__entry__container', 'inside')
      }
    },
    error: function() {
      errorMessage('Произошла ошибка', '.admin__entry__container', 'inside')
    }
  })
})
