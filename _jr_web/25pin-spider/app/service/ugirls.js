/**
 * 美女照片
 *
 * @link https://m.ugirls.com/m/?wapsource=ugirls
 */

'use strict';

const { JSDOM } = require('jsdom');
const MUgirls = require('../models/ugirls');
const MUgirlsTag = require('../models/ugirlsTag');
const DBUgirlsUtils = require('../db/ugirlsUtils');

module.exports = app => {

  class UgirlsSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbUgirlsUtils = new DBUgirlsUtils(app);
    }

    async run() {
      this.logger.info('run() start.');

      const ugirlsIds = await this.fetchUgirls();
      await this.fetchUgirlsImage(ugirlsIds);

      this.logger.info('run() end.');
    }

    // 爬取所有美女ID列表
    async fetchUgirls() {
      this.logger.debug('fetchUgirls start.');

      const ugirlsIds = [];

      // 最多爬取100页
      for (let i = 1; i <= 100; i++) {
        try {
          const dom = await JSDOM.fromURL(`https://www.ugirls.com/Content/Page-${i}.html`, {
            userAgent: this.app.config.spider.ua_pc,
          });

          const aTags = dom.window.document.querySelectorAll('.magazine_list_wrap .magazine_item .magazine_item_wrap');

          if (aTags && aTags.length > 0) {
            Object.getOwnPropertyNames(aTags).forEach(index => {
              const id = parseInt(aTags[index].getAttribute('href').match(/[1-9][0-9]*/g)[0]);
              if (id) {
                ugirlsIds.push(id);
              }
            });
          } else {
            break;
          }
        } catch (e) {
          this.logger.warn(e);
          break;
        }
      }

      this.logger.debug('fetchUgirls end. count: ', ugirlsIds.length);

      return Promise.resolve(ugirlsIds);
    }

    // 通过ID去爬取美女的所有图片并更新数据库
    async fetchUgirlsImage(ugirlsIds) {
      this.logger.debug('fetchUgirlsImage start.');

      for (let i = 0; i < ugirlsIds.length; i++) {
        const ugirlsId = ugirlsIds[i];

        const url = `https://www.ugirls.com/Content/List/Magazine-${ugirlsId}.html`;

        try {
          const dom = await JSDOM.fromURL(url, {
            userAgent: this.app.config.spider.ua_pc,
          });

          // 名称
          const name = dom.window.document.querySelector('.ren .ren_head .ren_head_c a').textContent;
          // 头像
          const avatar = dom.window.document.querySelector('.detail .album_img img').getAttribute('src');
          // 描述
          let description = dom.window.document.querySelector('.detail .info .js p').textContent;

          if (description) {
            description = description.replace('尤果网', '');
            description = description.replace('尤果网', '爱玩品资源站');
          }

          const ugirls = new MUgirls({
            id: ugirlsId,
            name,
            avatar,
            description,
          });

          // tags
          const aTags = dom.window.document.querySelectorAll('.detail .intag dd a');
          if (aTags && aTags.length > 0) {
            Object.getOwnPropertyNames(aTags).forEach(index => {
              const tag = new MUgirlsTag({
                id: parseInt(aTags[index].getAttribute('href').match(/[1-9][0-9]*/g)[0]),
                name: aTags[index].textContent,
              });

              // 更新标签数据库
              this.dbUgirlsUtils.addTag(tag);

              // 更新 ugirls 对象
              ugirls.addTag(tag.id);
            });
          }

          // 照片
          const frame = dom.window.document.querySelectorAll('#myGallery li img');
          if (frame && frame.length > 0) {
            Object.getOwnPropertyNames(frame).forEach(index => {
              const imageUrl = frame[index].getAttribute('src');

              if (imageUrl && imageUrl.length > 0) {
                ugirls.addImage(imageUrl);
              }
            });
          }

          // 排重
          // ugirls.images = this.ctx.helper.deduplicates(ugirls.images);

          this.dbUgirlsUtils.addUgirls(ugirls);
        } catch (e) {
          this.logger.warn(e);
        }
      }

      this.logger.debug('fetchUgirlsImage end.');

      return Promise.resolve();
    }

  }

  return UgirlsSerivce;
};
