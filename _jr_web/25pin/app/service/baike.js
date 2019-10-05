/**
 * 百科
 */

'use strict';

const DBBaikeUtils = require('../db/baikeUtils');

module.exports = app => {

  class ArticleSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbBaikeUtils = new DBBaikeUtils(app);
    }

    // 获取百科详情
    async getDetail(id = 0) {
      return this.dbBaikeUtils.getDetail(id);
    }

    // 获取上一篇百科
    async getPreDetail(id = 0) {
      return this.dbBaikeUtils.getPreDetail(id);
    }

    // 获取下一篇百科
    async getNextDetail(id = 0) {
      return this.dbBaikeUtils.getNextDetail(id);
    }

    async accessOnce(id) {
      return this.dbBaikeUtils.accessOnce(id);
    }

    async searchByTitle(key='', offset=0, count=20) {
      return this.dbBaikeUtils.searchByTitle(key, offset, count);
    }

    async getCateList() {
      return this.dbBaikeUtils.getCateList();
    }

    async getSubcateList(cate) {
      return this.dbBaikeUtils.getSubcateList(cate);
    }

    async getList(offset = 0, count = 10, cate = 0, subcate = 0) {
      return this.dbBaikeUtils.getList(offset, count, cate, subcate);
    }

    async searchByTitle(key='', offset=0, count=20) {
      return this.dbBaikeUtils.searchByTitle(key, offset, count);
    }
  }

  return ArticleSerivce;
};
