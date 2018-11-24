'use strict';

const Controller = require('egg').Controller;
const links = require('../constant/CLinks');
const CResourceType = require('../constant/CResourceType');

class HomeController extends Controller {
  async index() {
    const [ /* newsList,*/ articleList, ugirlsList, softList, gameList ] = await Promise.all([
      // this.service.home.getNewsList(6),
      this.service.article.getHotList(),
      this.service.ugirls.getHotUgirlsList(0, 0, 6),
      this.service.app.getHotList(CResourceType.soft, 0, 8),
      this.service.app.getHotList(CResourceType.game, 0, 8),
    ]);

    // this.app.logger.debug(topicList);

    const photoList = [];
    for (let i = 0; i < ugirlsList.length; i++) {
      photoList.push({
        url: '/photo/' + ugirlsList[i].id,
        image: ugirlsList[i].avatar,
      });
    }

    await this.ctx.layoutRender('pages/home/index.ejs', {
      name: 'home',
      title: this.app.config.biz.title,
      keywords: this.app.config.biz.keywords,
      description: this.app.config.biz.description,
      canonical: this.app.config.biz.server,
      gameList,
      softList,
      photoList, // 美女图片
      articleList, // 文章列表
      // newsList, // 新闻列表
      links, // 友链
    });
  }

  async robots() {
    this.ctx.body =
      'User-agent: Baiduspider\n' +
      'Allow: /mip/\n' +
      'Disallow: /api/\n' +
      '\n' +
      'User-agent: *\n' +
      'Allow: /\n' +
      'Disallow: /mip/\n' +
      'Disallow: /api/\n';
  }
}

module.exports = HomeController;
