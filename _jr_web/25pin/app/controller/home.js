'use strict';

const Controller = require('egg').Controller;
const links = require('../constant/CLinks');
const CResourceType = require('../constant/CResourceType');

class HomeController extends Controller {
  async index() {
    const [ articleList, articleHotList, ugirlsList/*, softList, gameList*/ ] = await Promise.all([
      this.service.article.getAvailableList(0, 6),
      this.service.article.getHotList(0, 12),
      this.service.ugirls.getHotUgirlsList(0, 0, 9),
      // this.service.app.getHotList(CResourceType.soft, 0, 8),
      // this.service.app.getHotList(CResourceType.game, 0, 8),
    ]);

    // this.app.logger.debug(topicList);

    const photoList = [];
    for (let i = 0; i < ugirlsList.length; i++) {
      photoList.push({
        url: '/photo/' + ugirlsList[i].id,
        image: ugirlsList[i].avatar,
        name: '美女' + ugirlsList[i].name + '写真集',
      });
    }

    // 备案时用
    // await this.ctx.render('pages/beian/index.ejs');
    // return;

    await this.ctx.layoutRender('pages/home/index.ejs', {
      name: 'home',
      title: this.app.config.biz.title,
      keywords: this.app.config.biz.keywords,
      description: this.app.config.biz.description,
      canonical: this.app.config.biz.server,
      // banner: { image: 'http://www.6down.net/uploadfile/2018/0605/20180605050352840.jpg', url: '/topic/3', name: '抖音热游榜' },
      // gameList,
      // softList,
      photoList, // 美女图片
      articleList, // 文章列表
      articleHotList, // 热门文章列表
      links, // 友链
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
      },
    });
  }

  async robots() {
    this.ctx.body =
      'User-agent: Baiduspider\n' +
      'Allow: /mip/\n' +
      'Disallow: /api/\n' +
      'Disallow: /about/\n' +
      '\n' +
      'User-agent: *\n' +
      'Allow: /\n' +
      'Disallow: /mip/\n' +
      'Disallow: /api/\n' + 
      'Disallow: /about/\n';
  }
}

module.exports = HomeController;
