function _createModal(options){
  modal_html = ''
  if (options.is_post) {
    modal_html += `
    <div class="modal">
      <div class="modal__overlay" data-close="true">
        <div class="modal__container">
          <div class="modal__window">
            <div class="modal__title">
              <div class="user"><img src="${options.card.find('.user__logo').attr('src')}" alt="" class="user__logo"><a href="" class="user__link">${options.card.find('.user__link').html()}</a></div>
              <div class="modal__close" data-close="true"><span class="modal__close__cross" data-close="true">&times;</span></div>
            </div>
            <div class="modal__body">
              <p class="modal__text">${options.card.find('.content__text').html()}</p>
    `
    if (options.card.find('.img__container').length !== 0) {
      modal_html += `
                <div class="modal__img__container">
                  <div id="leftSwitch" class="modal__switch" data-switch_left="true" style="display: none"><img src="/staticfiles/img/arrow-left-white.svg" alt="" data-switch_left="true"></div>
                  <a href="${options.card.find('.img1').attr('src')}" target="_blank"><img src="${options.card.find('.img1').attr('src')}" alt="" class="modal__img"></a>
                  <div id="rightSwitch" class="modal__switch" data-switch_right="true"><img src="/staticfiles/img/arrow-right-white.svg" alt="" data-switch_right="true"></div>
                </div>
      `
    }
    cardHTML +=`          
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  } else {
    // custom modal
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
  // removes the cross from the modal
  if(options.noCross) {
    $('.modal__close').remove()
  }
  return $modal
}

const modal = function (options) {
  const $modal = _createModal(options)
  let imgCount = 0
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
      if (options.is_post) {
        document.removeEventListener('click', switchListener)
      }
      $modal.get(0).removeEventListener('click', closeListener)
      $modal.remove()
      $('body').get(0).style.overflow = 'auto'
      window.onhashchange = null
      if(hash_change) {
        history.back()
      }
    }
  }
  const closeListener = (event) => {
    if (event.target.dataset.close){
     modal.close()
    }
  }
  let imgNum = null
  const switchListener = (event) => {
    // change the image in the modal
    if (event.target.dataset.switch_left) {
      if (imgCount > 0) {
        imgCount--
        let imgLink = options.card.find('.img__container > img').eq(imgCount).attr('src')
        $modal.find('.modal__img').prop('src', imgLink)
        $modal.find('.modal__img__container > a').prop('href', imgLink)
        if (imgCount === 0) {
          $('#leftSwitch').css('display', 'none')
        }
        if (imgCount == imgNum - 2) {
          $('#rightSwitch').css('display', 'flex')
        }
      }
    } else if (event.target.dataset.switch_right) {
      if (imgCount < imgNum - 1){
        imgCount++
        if (imgCount === 1) {
          $('#leftSwitch').css('display', 'flex')
        }
        if (imgCount == imgNum - 1) {
          $('#rightSwitch').css('display', 'none')
        }
        let imgLink = options.card.find('.img__container > img').eq(imgCount).attr('src')
        $modal.find('.modal__img').prop('src', imgLink)
        $modal.find('.modal__img__container > a').prop('href', imgLink)
      }
    }
  }
  $modal.get(0).addEventListener('click', closeListener)

  if (options.is_post) {
    // images quantity in the card
    imgNum = options.card.find('.img__container > img').length
    if (imgNum == 1) {
      $('#rightSwitch').css('display', 'none')
    }
    document.addEventListener('click', switchListener)
  }
  
  return modal
}