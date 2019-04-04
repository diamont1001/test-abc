'use strict';

const Controller = require('egg').Controller;
const links = require('../constant/CLinks');
const CResourceType = require('../constant/CResourceType');

class HomeController extends Controller {
  async index() {
    const [ articleList, articleHotList/*, ugirlsList, ugirlsHotList*/] = await Promise.all([
      this.service.article.getAvailableList(0, 15),
      this.service.article.getHotList(0, 12),
      // this.service.ugirls.getUgirlsList(0, 0, 6),
      // this.service.ugirls.getHotUgirlsList(0, 0, 6),
    ]);

    // const photoList = [];
    // for (let i = 0; i < ugirlsList.length; i++) {
    //   photoList.push({
    //     url: '/photo/' + ugirlsList[i].id,
    //     image: ugirlsList[i].avatar,
    //     name: '美女' + ugirlsList[i].name + '写真集',
    //   });
    // }

    // const photoHotList = [];
    // for (let i = 0; i < ugirlsHotList.length; i++) {
    //   photoHotList.push({
    //     url: '/photo/' + ugirlsHotList[i].id,
    //     image: ugirlsHotList[i].avatar,
    //     name: '美女' + ugirlsHotList[i].name + '写真集',
    //   });
    // }

    const pageNavs = [
      { url: '/article/rank', image: '/public/images/rank.png', name: '排行榜' },
      { url: '/article/t_1', image: '/public/images/tags/article_1.png', name: '冷知识' },
      { url: '/article/t_2', image: '/public/images/tags/article_2.png', name: '生活小常识' },
      { url: '/article/t_12', image: '/public/images/tags/article_12.png', name: '母婴' },
      { url: '/article/t_7', image: '/public/images/tags/article_7.png', name: '英语' },
      { url: '/article/t_3', image: '/public/images/tags/article_3.png', name: '文学' },
    ];

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
      pageNavs,
      // photoList, // 美女图片
      // photoHotList, // 热门美女图片
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
