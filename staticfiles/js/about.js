let = count = 0
if (localStorage.getItem('count')) {
  count = localStorage.getItem('count')
}
function checkState() {
  if (count === 0) {
    console.log('ok');
  } else if (count >= 3 && count < 6) {
    $('#dont_text').css('display', 'inline-block')
  } else if (count >= 6 && count < 9) {
    $('#dont_text').css('display', 'none')
    $('#dont_click').css('margin-left', 'auto')
  } else if (count >= 9 && count < 12) {
    $('#dont_click').css('margin-left', 'initial')
    $('#dont_click').css('margin-top', '700vh')
  } else if (count >= 12 && count < 15) {
    $('#dont_click').css('margin-top', '10vh')
    $('#okay_click').css('display', 'block')
  } else if (count >= 15) {
    $('#dont_click').css('margin-top', '10vh')
    $('.about__support').html('Ладно ты победил, можешь нажать на кнопку, смелее')
    $('#okay_click').css('display', 'none')
  }
}

checkState()

$(document).click(function (e) {
  if (e.target.dataset.dont) {
    count++
    if (count <= 15) {
      localStorage.setItem('count', count)
      checkState()
    }
    if (count >= 16) {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley', '_blank')
    }
  }
})