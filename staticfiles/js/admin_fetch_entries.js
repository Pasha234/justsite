$(document).ready(function() {
  $.ajax({
    url: '../modules/admin/views/fetch.php',
    type: 'GET',
    data: {entries: 1},
    success: function(response) {
      if (response.success === 1) {
        for (let entryKey in response.entries) {
          const entry = response.entries[entryKey]
          let text = ''
          if (entry.text.length > 40) {
            text = entry.text.substr(0, 40)
            text += '...'
          } else {
            if (entry.text) {
              text = entry.text
            } else {
              text = 'Без текста'
            }
          }
          if (entry.deleted === 1) {
            text += ' (Удалено)'
          }
          const entryHTML = `<a href="/admin/entries/${entry.id}"><div class="admin__panel__item"><span class="id">${entry.id}</span><span class="name">${text}</span></div></a>`
          $('.admin__panel').append($(entryHTML))
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