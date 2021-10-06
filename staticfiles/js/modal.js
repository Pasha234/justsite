
function _createModal(options){
  modal_html = ''
  if (options.is_post) {
    modal_html += `
    <div class="modal" id="modal">
      <div class="modal__overlay" data-close="true">
        <div class="modal__container">
          <div class="modal__window">
            <div class="modal__title">
              <div class="user"><img src="${options.user_logo}" alt="" class="user__logo"><a href="" class="user__link">${options.user_name}</a></div>
              <div class="modal__close" data-close="true"><span class="modal__close__cross" data-close="true">&times;</span></div>
            </div>
            <div class="modal__body">
              <p class="modal__text">${options.text}</p>
              <div class="modal__img__container"><a href="${options.img_link}" target="_blank"><img src="${options.img_link}" alt="" class="modal__img"></a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  } else {
    modal_html += `
    <div class="modal">
      <div class="modal__overlay" data-close="true">
        <div class="modal__container">
          <div class="modal__window">
            <div class="modal__title">
              ${options.title}
              <div class="modal__close" data-close="true"><span class="modal__close__cross" data-close="true">&times;</span></div>
            </div>
            <div class="modal__body">
              ${options.body}
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }
  const $modal = $(modal_html)
  $('.container').append($modal)
  if(options.noCross) {
    $('.modal__close').remove()
  }
  return $modal
}

const modal = function (options) {
  const $modal = _createModal(options)
  const modal = {
    open() {
      $('body').get(0).style.overflow = 'hidden'
      window.location.hash = "modal"
      window.onhashchange = (e) => {
        if (!e.newURL.match(/(\S*#modal)/gm)) {
          modal.close(false)
        }
      }
    },
    close(hash_change=true) {
      if (options.beforeClose) {
        options.beforeClose()
      }
      $modal.get(0).removeEventListener('click', listener)
      $modal.remove()
      $('body').get(0).style.overflow = 'auto'
      window.onhashchange = null
      if(hash_change) {
        history.back()
      }
    }
  }
  const listener = (event) => {
    if (event.target.dataset.close){
     modal.close()
    }
  }
  $modal.get(0).addEventListener('click', listener)

  return modal
}