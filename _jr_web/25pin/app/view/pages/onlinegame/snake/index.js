'use strict';

require('./index.less');
require('../../../modules/header');

const config = require('./config');
const game = require('./game');

$(function() {
  config.init(function() {
    // 初始化场景
    $('.game-wrap').css('width', config.backgroundW + 2 + config.X + 2);
    $('#canvasBg').attr('width', config.backgroundW + 2 + config.X);
    $('#canvasBg').attr('height', config.backgroundH + 2 + config.Y);
    $('#canvasBg').show();

    game.init($('#canvasBg')[0], onGameover);

    $('.game-control, .game-over').click(function() {
      $(this).hide();
      game.restart();
    });

    // 屏幕按钮
    $('.wrap-btn').on('touchstart', '.btn-left, .btn-right, .btn-up, .btn-down', function() {
      const $handle = $(this);

      if ($handle.hasClass('btn-left')) {
        game.onDirectLeft();
      } else if ($handle.hasClass('btn-right')) {
        game.onDirectRight();
      } else if ($handle.hasClass('btn-up')) {
        game.onDirectUp();
      } else if ($handle.hasClass('btn-down')) {
        game.onDirectDown();
      }
    });
  });
});

// 游戏结束
function onGameover(length) {
  $('.game-over .length').text(length);
  $('.game-over').show();
}
