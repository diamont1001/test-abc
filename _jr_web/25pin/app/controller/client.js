/**
 * 客户端接口
 */

'use strict';

const Controller = require('egg').Controller;
const Xor = require('../libs/xor');

class ClientController extends Controller {
  async articleList() {
    const offset = parseInt(this.ctx.request.body.offset) || 0;
    const count = parseInt(this.ctx.request.body.count) || parseInt(this.ctx.request.body.limit) || 20;
    const listType = parseInt(this.ctx.request.body.listtype) || 0;
    const tagId = parseInt(this.ctx.request.body.tag) || parseInt(this.ctx.request.body.tagId) || 0;

    let articleList;

    if (listType === 1) {
      articleList = await this.service.article.getHotList(offset, count);
    } else {
      articleList = await this.service.article.getAvailableListQuickly(offset, count, tagId);
    }

    this.ctx.formatListOutput(articleList);
  }

  async articleDetail() {
    const articleId = parseInt(this.ctx.request.body.id) || 0;
    const article = await this.service.article.getDetail(articleId);

    // this.app.logger.debug(article);

    if (!article || article.status !== 1) {
      this.ctx.status = 404;
      return;
    }

    // 访问一次，记录一下数据库
    this.service.article.accessOnce(articleId);

    this.ctx.formatActionOutput(article);
  }

  async articleSearch() {
    const offset = parseInt(this.ctx.request.body.offset) || 0;
    const key = this.ctx.request.body.key || '';

    const list = await this.service.article.searchByTitle(key, offset, 20);

    // this.app.logger.info('[client/articleSearch] key=(' + key + '), offset=(' + offset + ')');

    this.ctx.formatListOutput(list);
  }

  async tagList() {
    const list = await this.ctx.service.article.getTagList();

    this.ctx.formatListOutput(list);
  }

  async baikeCateList() {
    const list = await this.ctx.service.baike.getCateList();
    this.ctx.formatListOutput(list);
  }

  async baikeSubcateList() {
    const cate = parseInt(this.ctx.request.body.cate) || 0;
    const list = await this.ctx.service.baike.getSubcateList(cate);

    this.ctx.formatListOutput(list);
  }
}

module.exports = ClientController;
