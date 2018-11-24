'use strict';

const createSnake = require('./snake').createSnake;
const config = require('./config');

const GameControl = {
  isGameing: 0, // 游戏是否进行中
};

// 游戏初始化
GameControl.init = function(canvas, onGameover) {
  GameControl.canvas = canvas;
  GameControl.context = canvas.getContext('2d');
  GameControl.onGameover = onGameover;

  GameControl.resetBG();

  // 按键响应
  window.addEventListener('keydown', GameControl.anyKey, false);
};

// 重置游戏背景
GameControl.resetBG = function() {
  GameControl.context.clearRect(config.X, config.Y, config.backgroundW, config.backgroundH);
  GameControl.context.fillStyle = config.bgColor;
  GameControl.context.fillRect(config.X, config.Y, config.backgroundW, config.backgroundH);
  GameControl.context.strokeStyle = config.borderColor;
  GameControl.context.strokeRect(config.X - 1, config.Y - 1, config.backgroundW + 2, config.backgroundH + 2);
};

GameControl.restart = function() {
  if (GameControl.isGameing === 1) {
    return;
  }

  GameControl.gameOver();

  GameControl.curSnake = createSnake(GameControl.canvas);
  GameControl.curSnake.randFood();
  GameControl.isGameing = 1;
  GameControl.resetBG();
  GameControl.timerId = window.setInterval(GameControl.onTimer, config.gameInterval);
};

GameControl.gameOver = function() {
  const score = GameControl.curSnake ? GameControl.curSnake.getLength() : 0;

  GameControl.isGameing = 0;
  GameControl.curSnake = null;
  window.clearInterval(GameControl.timerId);

  return score;
};

GameControl.game = function() {
  GameControl.resetBG();
  GameControl.curSnake.show();
};


GameControl.onTimer = function() {
  if (GameControl.isGameing === 0) { return; }
  if (GameControl.curSnake.upDate() === 1) {
    const score = GameControl.gameOver();

    if (typeof GameControl.onGameover === 'function') {
      GameControl.onGameover(score);
    }
  } else {
    GameControl.game();
  }
};

GameControl.anyKey = function(e) {
  const ev = window.event || e; // 事件兼容写法
  const keyCode = ev.keyCode || ev.which || ev.charCode; // IE只有keyCode属性，FireFox中有which和charCode属性，Opera中有keyCode和which属性，Chrome中有keyCode、which和charCode属性。
  ev.preventDefault();

  switch (keyCode) {
    case 37: // left arrow
    case 65: // A
      GameControl.onDirectLeft();
      break;
    case 38: // up arrow
    case 87: // W
      GameControl.onDirectUp();
      break;
    case 39: // right arrow
    case 68: // D
      GameControl.onDirectRight();
      break;
    case 40: // down arrow
    case 83: // S
      GameControl.onDirectDown();
      break;
    default:
      // alert("You just pressed keycode : " + keyCode);
  }
};

GameControl.onDirectLeft = function() {
  if (GameControl.curSnake.curDirection !== 1) {
    GameControl.curSnake.nextDirection = 0;
  }
};

GameControl.onDirectRight = function() {
  if (GameControl.curSnake.curDirection !== 0) {
    GameControl.curSnake.nextDirection = 1;
  }
};

GameControl.onDirectUp = function() {
  if (GameControl.curSnake.curDirection !== 3) {
    GameControl.curSnake.nextDirection = 2;
  }
};

GameControl.onDirectDown = function() {
  if (GameControl.curSnake.curDirection !== 2) {
    GameControl.curSnake.nextDirection = 3;
  }
};


module.exports = GameControl;
