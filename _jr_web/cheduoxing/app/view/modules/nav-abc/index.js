'use strict';

require('./index.less');

$(function() {
  $('.jr-m-nav-abc').on('touchstart touchmove', 'li', function(e) {
    // 屏幕大小
    var winRect = getWinRect();

    // 触摸的实时位置
    var realPosition = {
      X: e.originalEvent.changedTouches[0].clientX,
      Y: e.originalEvent.changedTouches[0].clientY
    };

    // 触摸的实时 DOM
    var x = (winRect.width - 10) > 0 ? (winRect.width - 10) : realPosition.X;
    var realDom = document.elementFromPoint(x, realPosition.Y);

    var c = $(realDom).attr('data-id');

    if (c) {
      $('#nav-abc-' + c)[0].scrollIntoView();
    }

    return false;
  })
})

function getWinRect() {
  var winHeight = 0;
  var winWidth = 0;

  if (window.innerWidth) {
    winWidth = window.innerWidth;
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
  }
  if (window.innerHeight) {
    winHeight = window.innerHeight;
  } else if ((document.body) && (document.body.clientHeight)) {
    winHeight = document.body.clientHeight;
  }
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }

  return {
    width: winWidth,
    height: winHeight
  }
}