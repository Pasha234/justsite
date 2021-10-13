let redirect = true

document.addEventListener('click', (event) => {
  if(redirect){
    if(event.target.dataset.modal){
      let card = $(event.target.parentNode)
      if (!card.hasClass('content__card')) {
        card = card.parent()
      }
      const $modal = modal({
        is_post: true,
        card: card
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
