'use strict';

const Controller = require('egg').Controller;
const links = require('../constant/CLinks');

class HomeController extends Controller {
  async index() {
    const [ articleList, brandList ] = await Promise.all([
      this.service.article.getHotList(0, 12),
      this.service.brand.getAvailableList(0, 12),
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
    });
  }
}

module.exports = HomeController;
