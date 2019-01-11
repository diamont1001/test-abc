/**
 * 帮助页面（非 SEO）
 */

'use strict';

const Controller = require('egg').Controller;

class AboutController extends Controller {
  async contact() {
    await this.ctx.render('pages/about/contact/index.ejs', {
      layoutVersion: this.app.config.layoutVersion,
    });
  }
}

module.exports = AboutController;
