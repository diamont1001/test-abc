/**
 * 鹅说app
 *
 * @{@link http://goosetalk.com/home.html#/share/card?id=8848}
 */

'use strict';

const rp = require('request-promise');
const MArticle = require('../models/article');
const DBArticleUtils = require('../db/articleUtils');

module.exports = app => {

  class GoosetalkSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbArticleUtils = new DBArticleUtils(app);
    }

    async run(from = 0, to = 10000) {
      this.app.logger.info('fetch goosetalk start.');

      for (let i = from; i < to; i++) {
        const result = await this.dbArticleUtils.isExist(10000000 + i);
        if (!result) {
          await this.fetchData(i + '');
        } else {
          this.app.logger.debug('exist. id: ', i);
        }
      }

      this.app.logger.info('fetch goosetalk end.');
    }

    async fetchData(id) {
      const result = await rp({
        method: 'POST',
        uri: 'http://goosetalk.com/mobile/oapi/getCardInfo',
        json: true,
        headers: {
          referer: 'http://goosetalk.com/home.html',
          userAgent: this.app.config.spider.ua,
        },
        form: {
          id,
        },
      });

      // this.logger.debug(result);

      try {
        if (result && result.code && result.code === '1000'
          && result.data && result.data.card && result.data.card.words && result.data.card.words.length > 0) {
          const article = new MArticle({
            id: 10000000 + parseInt(id),
            title: '【冷知识】' + result.data.card.title,
            keywords: '冷知识,' + result.data.card.type,
            summary: result.data.card.summary,
            content: this.formatContent(result.data.card),
            type: 0,
            tags: '冷知识',
            author: 'goosetalk',
            app: 'com.atonce.goosetalk',
            status: 0,
            verifyState: 0,
            images: encodeURIComponent(result.data.card.image),
          });

          if (result.data.card.title.length < 8) {
            article.keywords += ',' + result.data.card.title;
          }

          // this.logger.debug(article);
          await this.dbArticleUtils.addArticle(article);
        } else {
          this.logger.debug('goosetalk not exist. id: ', id);
        }
      } catch (e) {
        // this.logger.warn(e);
      }

      return Promise.resolve();
    }

    formatContent(card) {
      let content = '';

      if (!card) {
        return content;
      }

      !!card.summary && (content += `${card.summary}\n\n`);

      !!card.image && (content += `![](${card.image})\n\n`);

      if (card.words && card.words.length > 0) {
        for (let i = 0; i < card.words.length; i++) {
          !!card.words[i].title && (content += `## ${i + 1}. ${card.words[i].title}\n\n`);
          !!card.words[i].content && (content += `${card.words[i].content}\n\n`);
          !!card.words[i].image && (content += `![](${card.words[i].image})\n\n`);
        }
      }

      return content;
    }

  }

  return GoosetalkSerivce;
};
