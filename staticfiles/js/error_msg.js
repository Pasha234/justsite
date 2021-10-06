function _createErr(text, after, location) {
  const $error = $(`<div class="error__message"><span class="err__text">${text}</span><div class="err__close" data-err_close="true">×</div></div>`)
  if (location === 'after') {
    $(after).after($error)
  } else if (location === 'inside') {
    $(after).append($error)
  }
  return $error
}
const errorMessage = function (text, after, location='after') {
  const $errMsg = _createErr(text, after, location)
  const errorMessage = {
    destroy() {
      $errMsg.remove()
    }
  }
  const listener = (e) => {
    if (e.target.dataset.err_close) {
      errorMessage.destroy()
    }
  }
  $errMsg.click(listener)
  return errorMessage
}