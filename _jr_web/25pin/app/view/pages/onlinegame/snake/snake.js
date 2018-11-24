/**
 * snake 类
 */

'use strict';

const config = require('./config');

// index x, y to slot[20*20] num
function index2slot(x, y) {
  return Math.floor((y * config.COL + x) / config.bodyW);
}
// get index x from slot[20*20] num
function getX(num) {
  return (num % config.COL) * config.bodyW;
}
// get index y from slot[20*20] num
function getY(num) {
  return Math.floor(num / config.COL) * config.bodyH;
}

// create a class of snake's body
function createBody(canvas, slotNum, color) {
  const BODY = {};

  BODY.canvas = canvas;
  BODY.x = getX(slotNum);
  BODY.y = getY(slotNum);
  BODY.color = color || config.bodyColor;

  BODY.isEqual = function(B) {
    if (this.x === B.x && this.y === B.y) { return 1; }
    return 0;
  };
  BODY.copyFrom = function(B) {
    this.x = B.x;
    this.y = B.y;
    this.color = B.color;
  };
  BODY.rand = function() {
    const num = Math.floor(Math.random() * config.ROW * config.COL);
    this.x = getX(num);
    this.y = getY(num);
  };
  BODY.show = function() {
    const context = BODY.canvas.getContext('2d');
    // context.clearRect(this.x+X, this.y+Y, bodyW, bodyH);
    context.fillStyle = this.color;
    context.fillRect(this.x + config.X, this.y + config.Y, config.bodyW, config.bodyH);
    context.lineWidth = 0.2;
    context.strokeStyle = '#2BB2BC';
    context.strokeRect(this.x + config.X, this.y + config.Y, config.bodyW, config.bodyH);
  };
  BODY.wipe = function() {
    // const context = BODY.canvas.getContext('2d');
    // context.clearRect(this.x+X, this.y+Y, bodyW, bodyH);
  };
  BODY.canMoveLeft = function() {
    if ((this.x - config.bodyW) >= 0) { return true; }
    return false;
  };
  BODY.canMoveRight = function() {
    if ((this.x + config.bodyW) < config.backgroundW) { return true; }
    return false;
  };
  BODY.canMoveUp = function() {
    if ((this.y - config.bodyH) >= 0) { return true; }
    return false;
  };
  BODY.canMoveDown = function() {
    if ((this.y + config.bodyH) < config.backgroundH) { return true; }
    return false;
  };
  BODY.moveLeft = function() {
    if (this.canMoveLeft()) {
      this.x = this.x - config.bodyW;
      return true;
    }
    return false;
  };
  BODY.moveRight = function() {
    if (this.canMoveRight()) {
      this.x = this.x + config.bodyW;
      return true;
    }
    return false;
  };
  BODY.moveUp = function() {
    if (this.canMoveUp()) {
      this.y = this.y - config.bodyH;
      return true;
    }
    return false;
  };
  BODY.moveDown = function() {
    if (this.canMoveDown()) {
      this.y = this.y + config.bodyH;
      return true;
    }
    return false;
  };

  return BODY;
}

/*
 * create a class of snake
 */
function createSnake(canvas) {
  const SNAKE = {};
  SNAKE.canvas = canvas;
  SNAKE.curDirection = 1; // 0:left 1:right 2:up 3:down
  SNAKE.nextDirection = 1;
  SNAKE.food = createBody(SNAKE.canvas, 0, config.foodColor);
  SNAKE.wipeBody = createBody(SNAKE.canvas, 0);
  SNAKE.isWipeBody = 0;

  SNAKE.hashArray = []; // 标志对应的空格是否被占用 0:没被占用, 1:已被占用
  for (let i = 0; i < config.COL * config.ROW; i++) {
    if (i < config.initSnakeLength) {
      SNAKE.hashArray[i] = 1;
    } else {
      SNAKE.hashArray[i] = 0;
    }
  }

  SNAKE.body = new Array(config.initSnakeLength); // snake 's body
  for (let i = 0; i < SNAKE.body.length; i++) {
    SNAKE.body[i] = createBody(SNAKE.canvas, i);
  }

  SNAKE.randFood = function() {
    let counter = 10;
    while (counter > 0) {
      counter--;
      this.food.rand();
      if (this.hashArray[index2slot(this.food.x, this.food.y)] === 0) {
        return;
      }
    }
    for (let i = (config.COL * config.ROW / 2); i < config.COL * config.ROW; i++) {
      if (this.hashArray[i] === 0) {
        this.food.x = getX(i);
        this.food.y = getY(i);
        return;
      }
    }
    for (let i = (config.COL * config.ROW / 2 - 1); i >= 0; i--) {
      if (this.hashArray[i] === 0) {
        this.food.x = getX(i);
        this.food.y = getY(i);
        return;
      }
    }
  };

  /*
   * 贪吃蛇核心函数
   * 0: ok
   * 1: game over
   */
  SNAKE.upDate = function() {
    let flag = 0;
    switch (this.nextDirection) {
      case 0:
        flag = this.goLeft();
        break;
      case 1:
        flag = this.goRight();
        break;
      case 2:
        flag = this.goUp();
        break;
      case 3:
        flag = this.goDown();
        break;
      default:
        break;
    }
    this.curDirection = this.nextDirection;
    if (flag !== 1) {
      flag = this.updateFlag();
    }
    return flag;
  };

  SNAKE.updateFlag = function() {
    if (this.hashArray[index2slot(SNAKE.body[SNAKE.body.length - 1].x, SNAKE.body[SNAKE.body.length - 1].y)] === 1) {
      if (SNAKE.body[SNAKE.body.length - 1].isEqual(this.food)) { // eat a food
        // alert("ate.");
        const tmpBody = createBody(SNAKE.canvas, 0);
        tmpBody.x = this.x;
        tmpBody.y = this.y;
        SNAKE.body.unshift(tmpBody);
        this.randFood();
      } else {
        return 1; // game over
      }
    }
    if (this.isWipeBody === 1) {
      this.hashArray[index2slot(this.wipeBody.x, this.wipeBody.y)] = 0;
    }
    for (let i = 0; i < SNAKE.body.length; i++) {
      this.hashArray[index2slot(SNAKE.body[i].x, SNAKE.body[i].y)] = 1;
    }
    this.hashArray[index2slot(this.food.x, this.food.y)] = 1;
    return 0;
  };

  SNAKE.show = function() {
    if (this.isWipeBody === 1) {
      this.wipeBody.wipe();
      this.isWipeBody = 0;
    }
    for (let i = 0; i < SNAKE.body.length; i++) {
      SNAKE.body[i].show();
    }
    this.food.show();
  };

  SNAKE.goLeft = function() {
    if (this.curDirection === 1) {
      return -1; // no move
    }
    if (!SNAKE.body[SNAKE.body.length - 1].canMoveLeft()) {
      return 1; // game over
    }
    this.wipeBody.copyFrom(SNAKE.body[0]);
    this.isWipeBody = 1;
    for (let i = 0; i < (SNAKE.body.length - 1); i++) {
      SNAKE.body[i].copyFrom(SNAKE.body[i + 1]);
    }
    SNAKE.body[SNAKE.body.length - 1].moveLeft();
    this.curDirection = 0;
    return 0; // move ok
  };
  SNAKE.goRight = function() {
    if (this.curDirection === 0) {
      return -1; // no move
    }
    if (!SNAKE.body[SNAKE.body.length - 1].canMoveRight()) {
      return 1; // game over
    }
    this.wipeBody.copyFrom(SNAKE.body[0]);
    this.isWipeBody = 1;
    for (let i = 0; i < (SNAKE.body.length - 1); i++) {
      SNAKE.body[i].copyFrom(SNAKE.body[i + 1]);
    }
    SNAKE.body[SNAKE.body.length - 1].moveRight();
    this.curDirection = 1;
    return 0; // move ok
  };
  SNAKE.goUp = function() {
    if (this.curDirection === 3) {
      return -1; // no move
    }
    if (!SNAKE.body[SNAKE.body.length - 1].canMoveUp()) {
      return 1; // game over
    }
    this.wipeBody.copyFrom(SNAKE.body[0]);
    this.isWipeBody = 1;
    for (let i = 0; i < (SNAKE.body.length - 1); i++) {
      SNAKE.body[i].copyFrom(SNAKE.body[i + 1]);
    }
    SNAKE.body[SNAKE.body.length - 1].moveUp();
    this.curDirection = 2;
    return 0; // move ok
  };
  SNAKE.goDown = function() {
    if (this.curDirection === 2) {
      return -1; // no move
    }
    if (!SNAKE.body[SNAKE.body.length - 1].canMoveDown()) {
      return 1; // game over
    }
    this.wipeBody.copyFrom(SNAKE.body[0]);
    this.wipeBody.y = SNAKE.body[0].y;
    this.isWipeBody = 1;
    for (let i = 0; i < (SNAKE.body.length - 1); i++) {
      SNAKE.body[i].copyFrom(SNAKE.body[i + 1]);
    }
    SNAKE.body[SNAKE.body.length - 1].moveDown();
    this.curDirection = 3;
    return 0; // move ok
  };
  SNAKE.getScore = function() {
    return SNAKE.body.length;
  };

  SNAKE.getLength = function() {
    return SNAKE.body.length;
  };

  return SNAKE;
}

module.exports = { createSnake };
