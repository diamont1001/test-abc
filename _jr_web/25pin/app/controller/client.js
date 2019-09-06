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
}

module.exports = ClientController;
