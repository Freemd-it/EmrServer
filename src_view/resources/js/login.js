import _ from 'lodash'

function init() {
  if (window.location.pathname === '/login') slideImage()
}

function slideImage(len, i) {

  const doms = $('.slide-img')
  const length = len || doms.length
  const index = i || 1;

  _.eq(index, 1) ? fadeInOut($(doms[length - 1]), $(doms[index - 1])) : fadeInOut($(doms[index - 2]), $(doms[index - 1]))

  setTimeout(() => {
    return slideImage(length, (index >= length ? 1 : index + 1))
  }, 5000)
}

function fadeInOut (source, target) {
  source
  .fadeOut(1500, () => {
    target.fadeIn(1500)
  })
}

function fadeButtonAnimation (outContent, inContent) {
  $(outContent)
    .transition({
      animation: 'fade left',
      duration: 300
    })
  setTimeout(() => {
    $(inContent)
        .transition({
          animation: 'fade right',
          duration: 300
        })
  }, 300)
}

$('#login-special').on('click', () => fadeButtonAnimation('#login-special', '.special-login-form-wrap'))
$('#login-special-cancel-btn').on('click', () => fadeButtonAnimation('.special-login-form-wrap', '#login-special'))

init()
