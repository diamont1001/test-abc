/**
 * 文章
 */

'use strict';

const DBArticleUtils = require('../db/articleUtils');

module.exports = app => {

  class ArticleSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbArticleUtils = new DBArticleUtils(app);
    }

    async getSitemap() {
      return this.dbArticleUtils.getSitemap();
    }

    // 获取到文章信息后，要调用一下该方法来获取标签数据才行
    async fetchArticlesTags(articles) {
      const tags = await this.getTagList();

      // 转成 hash 方便调用
      const tagsMap = {};
      tags.forEach((item) => {
        tagsMap[item.id] = item;
      });

      for (let i = 0; i < articles.length; i++) {
        for (let j = 0; j < articles[i].tags.length; j++) {
          const index = articles[i].tags[j];
          if (tagsMap[index]) {
            articles[i].tagList.push(tagsMap[index]);
          }
        }
      }

      return Promise.resolve();
    }

    // 获取文章详情
    async getDetail(id = 0) {
      const detail = await this.dbArticleUtils.getDetail(id);

      await this.fetchArticlesTags([detail]);

      return Promise.resolve(detail);
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
    async getAvailableList(offset = 0, count = 10, tag) {
      const list = await this.dbArticleUtils.getAvailableList(offset, count, tag);

      await this.fetchArticlesTags(list);

      return Promise.resolve(list);
    }

    // 获取热门文章列表
    async getHotList(offset = 0, count = 10) {
      const list = await this.dbArticleUtils.getHotList(offset, count);

      await this.fetchArticlesTags(list);

      return Promise.resolve(list);
    }

    // 获取最新文章列表
    async getNewList(offset = 0, count = 10) {
      const list = await this.dbArticleUtils.getNewList(offset, count);

      await this.fetchArticlesTags(list);

      return Promise.resolve(list);
    }

    async accessOnce(id) {
      return this.dbArticleUtils.accessOnce(id);
    }

    async getTagList() {
      return this.dbArticleUtils.getTagList();
    }
  }

  return ArticleSerivce;
};
