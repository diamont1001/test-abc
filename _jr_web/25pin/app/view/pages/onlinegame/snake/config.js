'use strict';

const Config = {
  X: 2, // the world coordinate : x
  Y: 2, // the world coordinate : y
  ROW: 20,
  COL: 20,

  borderColor: '#2BB2BC',
  bgColor: 'white',
  bodyColor: '#00FFFF',
  foodColor: '#EE5555',
  gameInterval: 80, // game speed (ms)
  initSnakeLength: 6,
};

Config.init = function(callback) {
  getWinSize(function(rect) {
    const winLength = Math.min(rect.width, rect.height - 200, 428) - 48;

    Config.bodyW = Math.floor(winLength / Config.COL);
    Config.bodyH = Math.floor(winLength / Config.ROW);

    // 消除除运算时出现的偏差
    Config.backgroundW = Config.bodyW * Config.COL;
    Config.backgroundH = Config.bodyH * Config.ROW;

    callback();
  });
};

function getWinSize(callback, times) {
  let winHeight = 0,
    winWidth = 0;
  times = isNaN(parseInt(times)) ? 10 : parseInt(times);

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
  if ((times-- > 0) && (winHeight <= 0 || winWidth <= 0)) {
    // webview有可能获取到的为0，延时再取一次
    setTimeout(function() {
      getWinSize(callback, times);
    }, 200);
  } else {
    callback({
      height: winHeight,
      width: winWidth,
    });
  }
}

module.exports = Config;
