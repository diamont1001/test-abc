'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = '25pin spider';
  }
}

module.exports = HomeController;
