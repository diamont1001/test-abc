/**
 * 搜索页
 */

'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  async index() {
    const key = (this.ctx.query.key || '').trim();
    let list = [];

    if (key) {
      list = await this.service.article.searchByTitle(key, 0, 20);

      this.app.logger.info('[search] key=(' + key + ')');
    }

    await this.ctx.render('pages/search/index.ejs', {
      layoutVersion: this.app.config.layoutVersion,
      list,
      key,
    });
  }

  async searchajax() {
    const offset = parseInt(this.ctx.query.offset) || 0;
    const key = this.ctx.query.key || '';

    const list = await this.service.article.searchByTitle(key, offset, 20);

    this.app.logger.info('[search ajax] key=(' + key + '), offset=(' + offset + ')');

    if (list && list.length > 0) {
      await this.ctx.render('pages/search/list.ejs', {
        list,
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = SearchController;
