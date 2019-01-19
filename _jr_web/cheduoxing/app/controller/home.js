'use strict';

const Controller = require('egg').Controller;
const links = require('../constant/CLinks');

class HomeController extends Controller {
  async index() {
    const [ articleList, brandList ] = await Promise.all([
      this.service.article.getNewList(0, 20),
      this.service.brand.getDetails([251, 176, 36, 406, 1, 41, 46, 71, 256, 56]),
    ]);

    await this.ctx.layoutRender('pages/home/index.ejs', {
      name: 'home',
      title: this.app.config.biz.title,
      keywords: this.app.config.biz.keywords,
      description: this.app.config.biz.description,
      canonical: this.app.config.biz.server,
      articleList,
      brandList,
      links,
      numberFormat: this.ctx.helper.numberFormat,
    });
  }
}

module.exports = HomeController;
