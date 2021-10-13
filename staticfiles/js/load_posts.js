let counter = 1
$(document).ready(function () {
  function loadPosts() {
    $.ajax({
      url: '/modules/blog/views/load_posts.php',
      type: 'GET',
      data: {page: counter},
      success: function(response) {
        const jsonData = response
        if (jsonData.success == 1) {
          for (let postKey in jsonData.posts) {
            const post = jsonData.posts[postKey]
            cardHTML = `
            <div class="content__card">
              <div class="user">
            `
            if (post.user_deleted == 0) {
              if (post.user_avatar) {
                cardHTML += `<img src="${post.user_avatar}" alt="" class="user__logo">`
              } else {
                cardHTML += `<img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">`
              }
              cardHTML += `
                    <a href="/users/${post.user_id}" class="user__link">${post.user_name}</a>
                  </div>
              `
            } else {
              cardHTML += `
                    <img src="/staticfiles/img/no-user-image-icon.jpg" alt="" class="user__logo">
                    <a href="/users/${post.user_id}" class="user__link">Удален</a>
                  </div>
              `
            }
            cardHTML += `
              <p class="content__text" data-modal="true">${post.text}</p>
            `
            if (post.imgs.length) {
              cardHTML += `<div class="img__container" data-modal="true">`
              for (img of post.imgs) {
                cardHTML += `<img class="img${img.img_order}" src="${img.img_link}" alt="" data-modal="true">`
              }
              cardHTML += `</div>`
            }
            cardHTML += `
              </div>
            </div>
            `
            $(cardHTML).insertBefore('#more_posts')
          }
          $('#more_posts').css('display', 'flex')
          counter++
          if (!jsonData.posts[10]) {
            $('#more_posts').css('display', 'none')
            $('body').off('click', loadListener)
          }
        } else {
          console.log('Jopa');
        }
      }
    })
  }
  $('body').on('click', loadListener)
  function loadListener(e) {
    if (e.target.dataset.load_more) {
      loadPosts()
    }
  }
  loadPosts()
})
