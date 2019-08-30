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
    const tagId = parseInt(this.ctx.request.body.tag) || 0;

    let articleList;

    if (listType === 1) {
      articleList = await this.service.article.getHotList(offset, count);
    } else {
      articleList = await this.service.article.getAvailableListQuickly(offset, count, tagId);
    }

    if (articleList && articleList.length > 0) {
      this.ctx.formatListOutput(articleList);
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = ClientController;
