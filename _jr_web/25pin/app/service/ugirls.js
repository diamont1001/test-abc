/**
 * 美女照片
 *
 * @link https://m.ugirls.com/m/?wapsource=ugirls
 */

'use strict';

const DBUgirlsUtils = require('../db/ugirlsUtils');

module.exports = app => {

  class UgirlsSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbUgirlsUtils = new DBUgirlsUtils(app);
    }

    async getUgirlsList(tagId = 0, offset = 0, count = 20) {
      return this.dbUgirlsUtils.getUgirlsList(tagId, offset, count);
    }

    async getAllUgirlsIds() {
      return this.dbUgirlsUtils.getAllUgirlsIds();
    }

    async getHotUgirlsList(tagId = 0, offset = 0, count = 20) {
      return this.dbUgirlsUtils.getHotUgirlsList(tagId, offset, count);
    }

    async getTagsList() {
      return this.dbUgirlsUtils.getTagsList();
    }

    async getTag(tagId) {
      return this.dbUgirlsUtils.getTag(tagId);
    }

    async getTags(tagIds) {
      return this.dbUgirlsUtils.getTags(tagIds);
    }

    async getUgirls(ugirlsId) {
      return this.dbUgirlsUtils.getUgirls(ugirlsId);
    }

    async getPreUgirls(ugirlsId) {
      return this.dbUgirlsUtils.getPreUgirls(ugirlsId);
    }

    async getNextUgirls(ugirlsId) {
      return this.dbUgirlsUtils.getNextUgirls(ugirlsId);
    }

    async accessOnceUgirls(ugirlsId) {
      return this.dbUgirlsUtils.accessOnceUgirls(ugirlsId);
    }

    async accessOnceTag(tagId) {
      return this.dbUgirlsUtils.accessOnceTag(tagId);
    }

  }

  return UgirlsSerivce;
};
