const name = document.getElementById('name').innerHTML
document.addEventListener('click', changeListener)

const inputListener = (event) => inputFunction(event, name)

function changeListener(event) {
  if (event.target.dataset.change_name) {
    document.removeEventListener('click', changeListener)
    $.ajax({
      type: 'POST',
      url: '/modules/users/views/change_name.php',
      data: {'check_changes': 1},
      success: function (response){
        const jsonData = JSON.parse(response)
        if (jsonData.success === 1) {
          if (jsonData.changes >= 1) {
            $input = $(`
            <form class="personal__name__form" method="post" action="${window.location.href}">
              <p class="personal__name__text">Новое имя (Вы можете сменить имя только 2 раза) (Осталось ${String(jsonData.changes).match(/(^\w*2$)|(^\w*3$)|(^\w*4$)/gm) ? (jsonData.changes + ' раза') : (jsonData.changes + ' раз')})</p>
              <input type="text" name="new_name" class="personal__name__change" placeholder="Введите новое имя" maxlength="32" autocomplete="off">
              <div class="personal__name__buttons">
                <input type="submit" class="personal__name__submit" value="" data-submit_input="true">
                <button type="button" class="personal__name__cancel" data-close_input="true"></button>
              </div>
            </div>`)
            $(".user__name").remove()
            $(".user__name__change").remove()
            $(".personal__user").append($input)
            document.addEventListener('click', inputListener)
          } else {
            $('.error__message').remove()
            errorMessage('Вы исчерпали лимит смены имен', '.personal__avatar__change')
          }
        } else {
          if (jsonData.error) {
            $('.error__message').remove()
            errorMessage(jsonData.error, '.personal__avatar__change')
          } else {
            $('.error__message').remove()
            errorMessage('Произошла ошибка', '.personal__avatar__change')
          }
        }
      },
      error: function (){
        $('.error__message').remove()
        errorMessage('Произошла ошибка', '.personal__avatar__change')
      }
    })
    
  }
}

function inputFunction(event, name) {
  if (event.target.dataset.close_input) {
    $name = $(`
    <span class="user__name" id="name">${name}</span>
    <div class="user__name__change"><img src="staticfiles/img/pen.png" alt="" data-change_name="true"></div>`)
    $(".personal__name__form").remove()
    $(".personal__user").append($name)
    document.removeEventListener('click', inputListener)
    document.addEventListener('click', changeListener)
  } else if (event.target.dataset.submit_input) {
    document.removeEventListener('click', inputListener)
    event.preventDefault()
    const data = $(".personal__name__form").serialize();
    const re = /%20/gi;
    if (data.replace(re, '') === 'new_name=') {
      const $name = $(`
        <span class="user__name" id="name">${name}</span>
        <div class="user__name__change"><img src="staticfiles/img/pen.png" alt="" data-change_name="true"></div>`)
      $(".error__message").remove()
      $(".personal__name__form").remove()
      $(".personal__user").append($name)
      errorMessage('Вы не ввели новое имя', '.personal__avatar__change')
      document.addEventListener('click', changeListener)
    } else {
      $.ajax({
        type: "POST",
        url: "modules/users/views/change_name.php",
        data: $(".personal__name__form").serialize(),
        success: function(response)
        {
          const jsonData = JSON.parse(response)
          if (jsonData.success == "1"){
            window.location.href = window.location.href
          } else {
            const $name = $(`
              <span class="user__name" id="name">${name}</span>
              <div class="user__name__change"><img src="staticfiles/img/pen.png" alt="" data-change_name="true"></div>`)
            $(".error__message").remove()
            $(".personal__name__form").remove()
            $(".personal__user").append($name)
            errorMessage(jsonData.error, '.personal__avatar__change')
            document.addEventListener('click', changeListener)
          }
        },
        error: function()
        {
          $name = $(`
              <span class="user__name" id="name">${name}</span>
              <div class="user__name__change"><img src="staticfiles/img/pen.png" alt="" data-change_name="true"></div>`)
          $(".error__message").remove()
          $(".personal__name__form").remove()
          $(".personal__user").append($name)
          errorMessage('Произошла ошибка', '.personal__avatar__change')
          document.addEventListener('click', changeListener)
        }
      })
    }
  }
}