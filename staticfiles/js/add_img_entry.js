const addImgListener = function(event) {
  if (event.target.dataset.add_image) {
    addDropArea()
  }
}

$('.add__form').on('submit', onSubmit)

function addDropArea() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)){
    $('#add-drop-area').css('display', 'block')
    $('#add-drop-area').addClass('add__img__mob')
    $('#add-drop-area p').html('Выберите файлы')
    $('.gallery').css('display', 'flex')
    $('.add__img__cancel').css('display', 'inline-block')
    const dropArea = document.getElementById('add-drop-area')
    $('#add-img-button').css('display', 'none')
    document.removeEventListener('click', addImgListener)
    document.addEventListener('click', (e) => cancelListener(e, dropArea))
  } else {
    $('#add-drop-area').css('display', 'block')
    $('.gallery').css('display', 'flex')
    $('.add__img__cancel').css('display', 'inline-block')
    const dropArea = document.getElementById('add-drop-area')
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => highlight(e, dropArea), false)
    })
    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => unhighlight(e, dropArea), false)
    })
    $('#add-img-button').css('display', 'none')
    document.removeEventListener('click', addImgListener)
    dropArea.addEventListener('drop', handleDrop)
    document.addEventListener('click', (e) => cancelListener(e, dropArea))
    
  }
}

const cancelListener = (e, dropArea) => {
  if (e.target.dataset.drop_area_cancel) {
    $('#add-drop-area').css('display', 'none')
    $('.add__img__cancel').css('display', 'none')
    $('.gallery').css('display', 'none')
    dropArea.addEventListener('drop', handleDrop)
    document.removeEventListener('click', (e) => cancelListener(e, dropArea))
    document.addEventListener('click', addImgListener)
    $('#add-img-button').css('display', 'flex')
    $('#postImg').val('')
    $('body').off('submit', '.add_form', e => onSubmit(e))
    $('.img__container').remove()
    $('.img__container').off('click', imgCancel)
  }
}

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

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  $('.add__form').off('submit', onSubmit)
  $('.add__form').on('submit', (e) => handleUploadFiles(e, files))

  handleFiles(files)
}

function handleUploadFiles(e, files) {
  files = [...files]
  files.forEach(uploadFile)
  $('body').off('submit', '.add_form', (e) => handleUploadFiles(e, files))
}

function onSubmit(e) {
  e.preventDefault()
  e.stopPropagation()
  uploadFile()
  $('body').off('submit', '.add_form', onSubmit)
}

function handleFiles(files) {
  files = [...files]
  files.forEach(previewFile)
}

function uploadFile(file=null) {
  let url = '/modules/blog/views/add_img_entry.php'
  let formData = new FormData()
  if (file) {
    formData.append('file', file)
  } else {
    formData.append('file', $('#postImg').prop('files').item(0))
  }
  formData.append('text', $('#add__text').val())
  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    if (result.success == 1) {
      window.location.href = 'http://' + window.location.hostname
    } else if(result.error) {
      for (error of result.error) {
        errorMessage(error, '.add__submit')
      }
    } else {
      errorMessage('Ошибка', '.add__submit')
    }
  })
  .catch(() => {errorMessage('Ошибка', '.add__submit')})
}

function imgCancel(e) {
  if (e.target.dataset.img_cancel) {
    $('#add-drop-area').css('display', 'block')
    $('#postImg').val('')
    $('.img__container').remove()
    $('.img__container').off('click', imgCancel)
    $('.add__form').on('submit', onSubmit)
  }
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    const $img = $(`
    <div class="img__container">
      <img src="${reader.result}" alt="">
      <div class="img__cancel"><span data-img_cancel="true">×</span></div>
    </div>`)
    $img.on('click', imgCancel)
    let $gallery = $('.gallery')
    $gallery.append($img)
    $('#add-drop-area').css('display', 'none')
  }
}

document.addEventListener('click', addImgListener)