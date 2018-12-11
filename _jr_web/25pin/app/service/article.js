/**
 * 文章
 */

'use strict';

const DBArticleUtils = require('../db/articleUtils');
const DBAppUtils = require('../db/appUtils');

module.exports = app => {

  class ArticleSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbArticleUtils = new DBArticleUtils(app);
      this.dbAppUtils = new DBAppUtils(app);
    }

    // 获取文章详情
    async getDetail(id = 0) {
      const article = await this.dbArticleUtils.getDetail(id);

      if (article && article.app) {
        const requestMq = [];
        for (let i = 0; i < article.app.length; i++) {
          requestMq.push(this.dbAppUtils.getDetail(article.app[i]));
        }
        article.relativeApp = await Promise.all(requestMq);
      }

      return Promise.resolve(article);
    }

    // 获取上一篇文章
    async getPreDetail(id = 0) {
      return this.dbArticleUtils.getPreDetail(id);
    }

    // 获取下一篇文章
    async getNextDetail(id = 0) {
      return this.dbArticleUtils.getNextDetail(id);
    }

    // 获取在线文章列表
    async getAvailableList(offset = 0, count = 10) {
      return this.dbArticleUtils.getAvailableList(offset, count);
    }

    // 获取热门文章列表
    async getHotList(offset = 0, count = 10) {
      return this.dbArticleUtils.getHotList(offset, count);
    }

    // 获取所有在线文章列表
    async getAllAvailableList() {
      let list = [];
      let result = null;
      let offset = 0;
      do {
        try {
          result = await this.service.article.getAvailableList(offset, 100);
          if (result && result.length > 0) {
            list = list.concat(result);
            offset = list.length;
          }
        } catch (e) {
          this.app.logger.warn(e);
        }
      } while (result && result.length > 0);

      const arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i] && list[i].id) {
          arr.push(this.app.config.biz.server + '/article/' + list[i].id);
        }
      }

      return Promise.resolve(arr);
    }

    async accessOnce(id) {
      return this.dbArticleUtils.accessOnce(id);
    }
  }

  return ArticleSerivce;
};
