document.addEventListener('click', (event) => {
  if (event.target.dataset.change_avatar) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)){
      const $modal = modal({
        is_post: false,
        title: '',
        body: '<div id="gallery" style="display: none"><div id="img__container"></div></div><label id="mob-image-input" for="fileElem"><form class="my-form"><p>Загрузите изображение с помощью диалога выбора файлов <small>(Файл должен быть меньше 20 Мб)</small></p><input type="file" id="fileElem" accept="image/*"></form></label>'
      })
      $modal.open()
      $('#fileElem').change(function() {
        handleFiles(this.files, $modal)
      })
    } else {
      const $modal = modal({
        is_post: false,
        title: '',
        body: '<div id="gallery" style="display: none"><div id="img__container"></div></div><label id="drop-area" for="fileElem"><form class="my-form"><p>Загрузите изображения с помощью диалога выбора файлов или перетащив нужные изображения в выделенную область <small>(Файл должен быть меньше 20 Мб)</small></p><input type="file" id="fileElem" accept="image/*"></form></label>'
      })
      $modal.open()
      $('#fileElem').change(function() {
        handleFiles(this.files, $modal)
      })
      const dropArea = document.getElementById('drop-area')
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
      })
      ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => highlight(e, dropArea), false)
      })
      ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => unhighlight(e, dropArea), false)
      })
      dropArea.addEventListener('drop', handleDrop)
    }
  }
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e, dropArea) {
  dropArea.classList.add('highlight')
}

function unhighlight(e, dropArea) {
  dropArea.classList.remove('highlight')
}

function handleDrop(e, $modal) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFiles(files, $modal)
}

function handleFiles(files, $modal) {
  files = [...files]
  files.forEach((file) => uploadFile(file, $modal))
  files.forEach(previewFile)
}

function uploadFile(file, $modal) {
  let url = '/modules/users/views/change_avatar.php'
  let formData = new FormData()

  formData.append('file', file)

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then((response) => response.json())
  .then((result) => {
    if (result.success === 1) {
      $('<div class="avatar__change__buttons" id="avatarBtns"><div class="avatar__change__submit" data-avatar_submit="true"></div><div class="avatar__change__cancel" data-avatar_cancel="true"></div></div>').insertAfter($('#gallery'))
      const listener = function(e) {
        if(e.target.dataset.avatar_submit) {
          document.removeEventListener('click', listener)
          $.ajax({
            type: 'POST',
            url: url,
            data: {'change': 1},
            success: function(response) {
              jsonData = JSON.parse(response)
              if (jsonData.success === 1) {
                window.location.href = window.location.origin + window.location.pathname
              } else {
                $modal.close()
                document.removeEventListener('click', listener)
                if (jsonData.error) {
                  $('.error__message').remove()
                  errorMessage(jsonData.error, '.personal__avatar__change')
                } else {
                  $('.error__message').remove()
                  errorMessage('Ошибка', '.personal__avatar__change')
                }
              }
            },
            error: function() {
              $modal.close()
              document.removeEventListener('click', listener)
              $('.error__message').remove()
              errorMessage('Ошибка', '.personal__avatar__change')
            }
          })
        } else if (e.target.dataset.avatar_cancel) {
          document.removeEventListener('click', listener)
          $.ajax({
            type: 'POST',
            url: url,
            data: {'delete': 1},
            success: function(response) {
              $('#drop-area').css('display', 'block')
              $('#mob-image-input').css('display', 'block')
              $('#img__container').empty()
              $('#gallery').css('display', 'none')
              $('#avatarBtns').remove()
              document.removeEventListener('click', listener)
              $('#img__container').css('bottom', 0)
              $('#img__container').css('right', 0)
              $('#fileElem').val('')
            },
            error: function() {
              $modal.close()
              document.removeEventListener('click', listener)
              $('.error__message').remove()
              errorMessage('Ошибка', '.personal__avatar__change')
            }
          })
        }
      }
      document.addEventListener('click', listener)
    } else if (result.error) {
      $modal.close()
      $('.error__message').remove()
      errorMessage(result.error, '.personal__avatar__change')
    } else {
      $modal.close()
      $('.error__message').remove()
      errorMessage('Ошибка', '.personal__avatar__change')
    }
  })
  .catch(() => {
    $modal.close()
    $('.error__message').remove()
    errorMessage('Ошибка', '.personal__avatar__change')
  })
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    const $img = new Image()
    $img.src = reader.result
    let $gallery = $('#gallery')
    $gallery.css('display', 'block')
    $img.onload = function() {
      $img.style.display = 'none'
      let height = $img.height
      let width = $img.width
      if (width > height) {
        const ratio = height / 200
        const rightIndent = ((width / ratio) - 200) / 2
        $img.style.height = '100%'
        $('#img__container').css('right', rightIndent)
      } else if (height > width) {
        const ratio = width / 200
        const bottomIndent = ((height / ratio) - 200) / 2
        $img.style.width = '100%'
        $('#img__container').css('bottom', bottomIndent)
      } else {
        $img.style.height = '100%'
      }
      $img.style.display = 'block'
    }
    $('#img__container').append($img)
    $('#drop-area').css('display', 'none')
    $('#mob-image-input').css('display', 'none')
  }
}