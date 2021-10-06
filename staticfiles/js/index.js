let redirect = true

document.addEventListener('click', (event) => {
  if(redirect){
    if(event.target.dataset.modal){
      const card = event.target.parentNode
      const $modal = modal({
        is_post: true,
        user_logo: card.querySelector('.user__logo').src,
        user_name: card.querySelector('.user__link').innerHTML,
        text: card.querySelector('.content__text').innerHTML,
        img_link: card.querySelector('.content__img').src
      })
      $modal.open()
    }
  }
})

document.addEventListener('mousedown', e => {
  if(e.target.dataset.modal)
    redirect = true
})

document.addEventListener('mousemove', e => {
  redirect = false
})
