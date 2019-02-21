'use strict';

const Controller = require('egg').Controller;
const sm = require('sitemap');
const Xor = require('../libs/xor');

class SitemapController extends Controller {
  async index() {
    let urls = [
      this.app.config.biz.server, // 首页
      this.app.config.biz.server + '/brand', // 品牌列表页
    ];

    // 第2000条URL生成一个 urlx.txt，用于推送
    // const fs = require('fs');
    // for (let i = 0, j = 0; i < urls.length; i+=2000, j++) {
    //   const ttdata = urls.slice(i, i + 2000);
    //   fs.writeFileSync('./logs/urls' + j + '.txt', ttdata.join('\n'));
    // }
    // this.ctx.body = 'hello';
    // return;

    const [ articleList, brandList ] = await Promise.all([
      this.service.article.getSitemap(),
      this.service.brand.getSitemap(),
    ]);

    // 文章详情页
    urls = urls.concat(articleList);

    // 品牌详情页
    urls = urls.concat(brandList);

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

  async robots() {
    this.ctx.body =
      'User-agent: Baiduspider\n' +
      'Allow: /mip/\n' +
      'Disallow: /api/\n' +
      'Disallow: /about/\n' +
      '\n' +
      'User-agent: Yisouspider\n' +
      'Allow: /mip/\n' +
      'Disallow: /api/\n' +
      'Disallow: /about/\n' +
      '\n' +
      'User-agent: MipYisouSpider\n' +
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

module.exports = SitemapController;
