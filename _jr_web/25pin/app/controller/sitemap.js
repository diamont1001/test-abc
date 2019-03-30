'use strict';

const Controller = require('egg').Controller;
const sm = require('sitemap');
const Xor = require('../libs/xor');

class SitemapController extends Controller {
  async index() {
    let urls = [
      this.app.config.biz.server, // 首页
      this.app.config.biz.server + '/article', // 文章列表页
      this.app.config.biz.server + '/article/rank', // 文章排行榜列表页
      this.app.config.biz.server + '/photo', // 图片列表页
      this.app.config.biz.server + '/onlinegame/snake', // 在线小游戏 - 贪吃蛇
    ];

    const [ articleTagList, articleList, photoTagsList, photoIds ] = await Promise.all([
      this.service.article.getTagList(),
      this.service.article.getAllAvailableList(),
      this.service.ugirls.getTagsList(),
      this.service.ugirls.getAllUgirlsIds(),
    ]);

    // 文章tags页
    for (let i = 0; i < articleTagList.length; i++) {
      urls.push(this.app.config.biz.server + '/article/t_' + articleTagList[i].id);
    }

    // 文章页
    urls = urls.concat(articleList);

    // 图片tags页
    for (let i = 0; i < photoTagsList.length; i++) {
      urls.push(this.app.config.biz.server + '/photo/t_' + photoTagsList[i].id);
    }

    // 图片详情页
    for (let i = 0; i < photoIds.length; i++) {
      urls.push(this.app.config.biz.server + '/photo/' + photoIds[i]);
    }

    // 第2000条URL生成一个 urlx.txt，用于推送
    // const fs = require('fs');
    // for (let i = 0, j = 0; i < urls.length; i+=2000, j++) {
    //   const ttdata = urls.slice(i, i + 2000);
    //   fs.writeFileSync('./logs/urls' + j + '.txt', ttdata.join('\n'));
    // }
    // this.ctx.body = 'hello';
    // return;


    const sitemap = sm.createSitemap({
      hostname: this.app.config.biz.server,
      cacheTime: 600000,
      urls,
    });

    this.ctx.set({
      'Content-Type': 'application/xml',
    });
    this.ctx.body = sitemap.toString();
    this.ctx.status = 200;
  }
}

module.exports = SitemapController;
