webpackHotUpdate(0,{

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

__webpack_require__(5);

__webpack_require__(6);

__webpack_require__(36);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(37);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(11);

__webpack_require__(12);

__webpack_require__(13);

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

$.uiAlert = function (options) {
  var setUI = $.extend({
    textHead: 'Your user registration was successful.',
    text: 'You may now log-in with the username you have chosen',
    textcolor: '#19c3aa',
    bgcolors: '#fff',
    position: 'top-right',
    icon: '',
    time: 5,
    permanent: false
  }, options);

  var ui_alert = 'ui-alert-content';
  ui_alert += '-' + setUI.position;
  setUI.bgcolors = 'style="background-color: ' + setUI.bgcolor + ';   box-shadow: 0 0 0 1px rgba(255,255,255,.5) inset,0 0 0 0 transparent;"';
  if (setUI.bgcolors === '') setUI.bgcolors = 'style="background-color: ; box-shadow: 0 0 0 1px rgba(255,255,255,.5) inset,0 0 0 0 transparent;"';
  if (!$('body > .' + ui_alert).length) {
    $('body').append('<div class="ui-alert-content ' + ui_alert + '" style="width: inherit;"></div>');
  }
  var message = $('<div id="messages" class="ui icon message" ' + setUI.bgcolors + '><i class="' + setUI.icon + ' icon" style="color: ' + setUI.textcolor + ';"></i><i class="close icon" style="color: ' + setUI.textcolor + ';" id="messageclose"></i><div style="color: ' + setUI.textcolor + '; margin-right: 10px;">   <div class="header">' + setUI.textHead + '</div>  <p> ' + setUI.text + '</p></div>  </div>');
  $('.' + ui_alert).prepend(message);
  message.animate({
    opacity: '1'
  }, 300);
  if (setUI.permanent === false) {
    var timer = 0;
    $(message).mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      uiAlertHide();
    });
    uiAlertHide();
  }
  function uiAlertHide() {
    timer = setTimeout(function () {
      message.animate({
        opacity: '0'
      }, 300, function () {
        message.remove();
      });
    }, setUI.time * 1000);
  }

  $('#messageclose').on('click', function () {
    $(this).closest('#messages').transition('fade');
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })

})