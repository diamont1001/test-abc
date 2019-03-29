/**
 * 宝宝树app
 *
 * @{@link https://m.babytree.com/knowledge/detail?id=9458}
 */

'use strict';

const rp = require('request-promise');
const { JSDOM } = require('jsdom');
const MArticle = require('../models/article');
const DBArticleUtils = require('../db/articleUtils');
const NUM_START_ID = 20000000; // 存储的起始ID值

module.exports = app => {

  class BabytreeSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbArticleUtils = new DBArticleUtils(app);
    }

    async run(from = 0, to = 10000) {
      this.app.logger.info('fetch babytree start.');

      for (let i = from; i < to; i++) {
        const result = await this.dbArticleUtils.isExist(NUM_START_ID + i);
        if (!result) {
          await this.fetchData(i);
        } else {
          this.app.logger.debug('exist. id: ', i);
        }
      }

      this.app.logger.info('fetch babytree end.');
    }

    async fetchData(id) {
      try {
        const res = await this.app.curl(`https://m.babytree.com/knowledge/detail?id=${id}`, {
          headers: {
            'User-Agent': this.app.config.spider.ua,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 8000,
        });

        if (res && res.status === 200) {
          const dom = new JSDOM(res.data);

          try {
            const $wrap = dom.window.document.querySelector('.mod-wrap');

            const $title = $wrap.querySelector('.know-subject');
            const $content = $wrap.querySelector('.article-content');
            const $video = $wrap.querySelector('.video-box');
            const $image = $wrap.querySelector('.video-box img');

            const title = $title ? $title.textContent : '';
            const content = ($content ? $content.textContent : '').trim().replace('展开阅读全文', '');
            const video = $video ? $video.getAttribute('data-video-url') : '';
            const image = $image ? $image.getAttribute('src') : '';

            if (title && content) {
              const article = new MArticle({
                id: NUM_START_ID + parseInt(id),
                title,
                keywords: '冷知识,孕育,怀孕,宝宝,准妈妈,准爸爸',
                content: content,
                type: 0,
                tags: '孕育',
                author: 'babytree',
                app: 'com.babytree.apps.pregnancy',
                status: 0,
                verifyState: 0,
                images: encodeURIComponent(image),
                video: video,
              });

              // this.logger.debug(article);
              await this.dbArticleUtils.addArticle(article);
            } else {
              this.logger.debug('babytree not exist. id: ', id);
            }
          } catch (e) {
            this.app.logger.warn(e);
          }
        }
      } catch (e) {
        this.app.logger.warn(e);
      }
      return Promise.resolve();
    }
  }

  return BabytreeSerivce;
};
