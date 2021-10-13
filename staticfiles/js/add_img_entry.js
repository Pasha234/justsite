const addImgListener = function(event) {
  if (event.target.dataset.add_image) {
    addDropArea()
  }
}

let files = []

$('.add__form').on('submit', (e) => {
  e.preventDefault()
})

$('.add__form').on('submit', onSubmit)

function addDropArea() {
  // Add drop-area (or input file for mobile users)
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)){
    // styles for mobile version
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
    // prevents default attitude
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    // highlight the form when the cursor with file in it
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => highlight(e, dropArea), false)
    })
    // unhighlight the form
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
  // when cancel button is pressed
  if (e.target.dataset.drop_area_cancel) {
    $('#add-drop-area').css('display', 'none')
    $('.add__img__cancel').css('display', 'none')
    $('.gallery').css('display', 'none')
    dropArea.removeEventListener('drop', handleDrop)
    document.removeEventListener('click', (e) => cancelListener(e, dropArea))
    document.addEventListener('click', addImgListener)
    $('#add-img-button').css('display', 'flex')
    files = []
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
  // extract files from drop area
  let dt = e.dataTransfer
  let newFiles = dt.files
  if (newFiles.length <= (5 - files.length)) {
    files = [...files, ...newFiles]
    // $('.add__form').off('submit', onSubmit)
    // $('.add__form').on('submit', handleUploadFiles)
    handleFiles(newFiles)
  } else {
    errorMessage('Слишком много изображений (максимум 5)', '.add__submit')
  }
  
}

function handleInput(inputFiles) {
  if (inputFiles.length <= (5 - files.length)) {
    files = [...files, ...inputFiles]
    handleFiles(inputFiles)
  } else {
    errorMessage('Слишком много изображений (максимум 5)', '.add__submit')
  }
}

// function handleUploadFiles(e) {
//   // handle files uploaded from drop area
//   e.preventDefault()
//   // files = [...files]
//   files.forEach(uploadFile)
//   // $('body').off('submit', '.add_form', handleUploadFiles)
//   $('.add__form').off('submit', handleUploadFiles)
// }

function onSubmit(e) {
  // on submitting the form
  e.preventDefault()
  e.stopPropagation()
  uploadFile()
  // $('body').off('submit', '.add_form', onSubmit)
  $('.add__form').off('submit', onSubmit)
}

function handleFiles(files) {
  // handle files uploaded from input file
  files = [...files]
  files.forEach(previewFile)
}

// function uploadFile(file=null) {
//   // upload file on the server by ajax
//   let url = '/modules/blog/views/add_img_entry.php'
//   let formData = new FormData()
//   if (file) {
//     formData.append('file', file)
//   } else {
//     formData.append('file', $('#postImg').prop('files').item(0))
//   }
//   formData.append('text', $('#add__text').val())
//   fetch(url, {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => response.json())
//   .then(result => {
//     if (result.success == 1) {
//       // window.location.href = 'http://' + window.location.hostname
//     } else if(result.error) {
//       for (error of result.error) {
//         errorMessage(error, '.add__submit')
//       }
//     } else {
//       errorMessage('Ошибка', '.add__submit')
//     }
//   })
//   .catch(() => {errorMessage('Ошибка', '.add__submit')})
// }

function uploadFile() {
  // upload files on the server by ajax
  let url = '/modules/blog/views/add_img_entry.php'
  let formData = new FormData()
  for (let i = 0; i < files.length; i++) {
    formData.append(String(i), files[i])
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
        $('.add__form').on('submit', onSubmit)
        errorMessage(error, '.add__submit')
      }
    } else {
      $('.add__form').on('submit', onSubmit)
      errorMessage('Ошибка', '.add__submit')
    }
  })
  .catch(() => {
    $('.add__form').on('submit', onSubmit)
    errorMessage('Ошибка', '.add__submit')
  })
}

function imgCancel(e, $img, file) {
  // put away canceled image
  if (e.target.dataset.img_cancel) {
    // $('#add-drop-area').css('display', 'block')
    // $('#postImg').val('')
    // $('.img__container').remove()
    // $('.img__container').off('click', imgCancel)
    files.splice(files.indexOf(file), 1)
    $img.remove()
    $img.off('click', (e) => imgCancel(e, $img, file))
  }
}

function previewFile(file) {
  // preview image
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    const $img = $(`
    <div class="img__container">
      <img src="${reader.result}" alt="">
      <div class="img__cancel"><span data-img_cancel="true">×</span></div>
    </div>`)
    $img.on('click', (e) => imgCancel(e, $img, file))
    let $gallery = $('.gallery')
    $gallery.append($img)
    // $('#add-drop-area').css('display', 'none')
  }
}

document.addEventListener('click', addImgListener)