/**
 * 品牌
 */

'use strict';

const { JSDOM } = require('jsdom');
const MBrand = require('../models/brand');
const DBBrandUtils = require('../db/brandUtils');

module.exports = app => {

  class ArticleSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbBrandUtils = new DBBrandUtils(app);
    }

    // 获取详情
    async getDetail(id = 0) {
      return this.dbBrandUtils.getDetail(id);
    }

    async getDetails(ids = []) {
      return this.dbBrandUtils.getDetails(ids);
    }

    // 获取上一个
    async getPreDetail(id = 0) {
      return this.dbBrandUtils.getPreDetail(id);
    }

    // 获取下一个
    async getNextDetail(id = 0) {
      return this.dbBrandUtils.getNextDetail(id);
    }

    // 获取在线品牌列表
    async getAvailableList(offset = 0, count = 10) {
      return this.dbBrandUtils.getAvailableList(offset, count);
    }

    // 获取热门品牌列表
    async getHotList(offset = 0, count = 10) {
      return this.dbBrandUtils.getHotList(offset, count);
    }

    async accessOnce(id) {
      return this.dbBrandUtils.accessOnce(id);
    }

    /****************************** 爬虫 ******************************/
    async run() {
      await this.fetchBrand();
    }

    async fetchBrand() {
      this.logger.info('fetchBrand() start.');

      const arr = [];

      try {
        const dom = await JSDOM.fromURL(`http://auto.16888.com/`, {
          userAgent: this.app.config.spider.ua_pc,
        });

        const hander = dom.window.document.querySelectorAll('.brand_box');

        if (hander && hander.length > 0) {
          Object.getOwnPropertyNames(hander).forEach(index => {
            // const brand = new MBrand({
            //   name: hander[index].querySelector('a').name,
            //   logo: hander[index].querySelector('a img').src,
            //   status: 1,
            // });

            // arr.push(brand);

            arr.push(hander[index].querySelector('.brand_mane a').href);
          });
        }

        for (let i = 0; i < arr.length; i++) {
          // await this.dbBrandUtils.addBrand(arr[i]);
          await this.updateLogo(arr[i]);
        }
      } catch (e) {
        this.logger.warn(e);
      }

      this.logger.info('fetchBrand() end.');
    }

    async updateLogo(url) {
      try {
        const dom = await JSDOM.fromURL(url, {
          userAgent: this.app.config.spider.ua_pc,
        });

        const image = dom.window.document.querySelector('.brand_mane a img').src;
        const name = dom.window.document.querySelector('.head_list .name a').textContent;

        // console.log(name, image);
        await this.dbBrandUtils.updateLogo(name, image);
      } catch (e) {
        this.logger.warn(e);
      }
    }
  }

  return ArticleSerivce;
};
