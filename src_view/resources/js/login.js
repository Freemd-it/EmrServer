import _ from 'lodash'
import http from '../utils/http';
import { resultCode } from '../utils/constant';

function init() {
  if (window.location.pathname === '/login') {
    slideImage()
    const error = getParameterByName('error')
    if (error) {
      printError(error)
    }
  }
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

$('#login-special-btn').on('click', () => {

  if(!($('input[name=special_account]').val()) || !($('input[name=special_password]').val())) {
    return $.uiAlert({
      textHead: '[경고]',
      text: '아이디 또는 비밀번호를 정확하게 입력해주세요!',
      bgcolor: '#4d4dff',
      textcolor: '#fff',
      position: 'top-left',
      time: 3,
    });
  }
  document.getElementById('special-login-form').submit();
})

$('input[name=special_password], input[name=special_account]').keyup((e) => {
  if(_.eq(e.keyCode, 13)) document.getElementById('special-login-form').submit();
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function printError(error) {
    switch (error) {
      case 'invalid_domain_' : showGuidePopup(); break;
      case 'auth_error_' : return $.uiAlert({
        textHead: '[경고]',
        text: '로그인에 실패하였습니다. 아이디 또는 비밀번호를 다시 확인해주세요!',
        bgcolor: '#4d4dff',
        textcolor: '#fff',
        position: 'top-left',
        time: 3,
      }); break;
      case 'unknown_error_' : return $.uiAlert({
        textHead: '[경고]',
        text: '알 수 없는 에러가 발생하였습니다. IT본부 단원에게 문의해주세요!',
        bgcolor: '#4d4dff',
        textcolor: '#fff',
        position: 'top-left',
        time: 5,
      }); break;
    }
}

function showGuidePopup() {
  $('.guide-modal').modal({closable: false}).modal('show');
}

init()
