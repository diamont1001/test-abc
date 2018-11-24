/**
 * 专题
 */

'use strict';

const DBTopicUtils = require('../db/topicUtils');

module.exports = app => {

  class TopicSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbTopicUtils = new DBTopicUtils(app);
    }

    // 获取专题详情
    async getDetail(id = 0) {
      const topic = await this.dbTopicUtils.getDetail(id);

      if (topic && topic.content && topic.content.apps && topic.content.apps.length > 0) {
        topic.content.apps.sort((a, b) => {
          return b.star - a.star;
        });
        return Promise.resolve(topic);
      }

      return Promise.resolve({});
    }

    // 获取上一篇专题
    async getPreDetail(id = 0) {
      return this.dbTopicUtils.getPreDetail(id);
    }

    // 获取下一篇专题
    async getNextDetail(id = 0) {
      return this.dbTopicUtils.getNextDetail(id);
    }

    // 获取在线专题列表
    async getAvailableList(offset = 0, count = 10) {
      return this.dbTopicUtils.getAvailableList(offset, count);
    }

    // 获取热门专题列表
    async getHotList(offset = 0, count = 10) {
      return this.dbTopicUtils.getHotList(offset, count);
    }

    // 获取所有在线专题id列表
    async getAllAvailableIds() {
      return this.dbTopicUtils.getAllAvailableIds();
    }

    async accessOnce(id) {
      return this.dbTopicUtils.accessOnce(id);
    }
  }

  return TopicSerivce;
};
