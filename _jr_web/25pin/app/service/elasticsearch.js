/**
 * elasticsearch 服务接口
 */

'use strict';

const rp = require('request-promise');
const ES_HOST = 'http://47.106.209.94:9200';
const ES_INDEX = '25pin';

const DBArticleUtils = require('../db/articleUtils');

module.exports = app => {

  class EsSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbArticleUtils = new DBArticleUtils(app);
    }

    async run() {
      await this.init();

      const tags = await this.service.article.getTagList();
      const tagsMap = {};
      tags.forEach((item) => {
        tagsMap[item.id] = item;
      });

      const articleList = await this.dbArticleUtils.getAllAvailableList();
      for (let i = 0; i < articleList.length; i++) {
        const article = {
          id: articleList[i].id,
          title: articleList[i].title,
          tags: articleList[i].tags.split(',').map(item => { return tagsMap[item].name; }),
          publish_time: articleList[i].publishTime,
        };
        await this.putDate(article);
      }

      // const list = await this.search('英语'); // text

      // await this.deleteIndex();
    }

    // 初始化，建立 article 表
    async init() {
      this.logger.info('es index create start.');

      try {
        const result = await rp({
          method: 'PUT',
          uri: `${ES_HOST}/${ES_INDEX}`,
          json: true,
          body: {
            'mappings': {
              'article': {
                'properties': {
                  'title': {
                    'type': 'text',
                    'analyzer': 'ik_max_word',
                    'search_analyzer': 'ik_max_word',
                  },
                  'tags': {
                    'type': 'text',
                    'analyzer': 'ik_max_word',
                    'search_analyzer': 'ik_max_word'
                  },
                  'publish_time': {
                    'type': 'date'
                  }
                }
              }
            }
          },
        });

        if (result && result.acknowledged) {
          this.logger.info('es index create ok.');
        } else {
          this.logger.warn(result);
        }
      } catch (e) {
        this.logger.warn(e.message);
      }

      return Promise.resolve();
    }

    async putDate(article) {
      try {
        const result = await rp({
          method: 'PUT',
          uri: `${ES_HOST}/${ES_INDEX}/article/${article.id}`,
          json: true,
          body: {
            title: article.title,
            tags: article.tags,
            publish_time: article.publish_time,
          }
        });

        if (result && result.acknowledged) {
          this.logger.info('es put article ok.');
        } else {
          this.logger.warn(result);
        }
      } catch (e) {
        this.logger.warn(e.message);
      }

      return Promise.resolve();
    }

    async search(key, offset=0, count=20) {
      if (!key || !key.trim()) {
        return Promise.resolve([]);
      }

      try {
        const result = await rp({
          method: 'GET',
          uri: `${ES_HOST}/${ES_INDEX}/article/_search`,
          json: true,
          qs: {
            q: key,
            from: offset,
            size: count,
          }
        });

        if (result && result.hits && result.hits.total > 0) {
          this.logger.info('es search article ok.', result.hits.total);
          return Promise.resolve(result.hits);
        } else {
          this.logger.warn(result);
        }
      } catch (e) {
        this.logger.warn(e.message);
      }

      return Promise.resolve([]);
    }

    async deleteIndex() {
      this.logger.info('es index delete start.');

      try {
        const result = await rp({
          method: 'DELETE',
          uri: `${ES_HOST}/${ES_INDEX}`,
        });

        if (result && result.acknowledged) {
          this.logger.info('es index delete ok.');
        } else {
          this.logger.warn(result);
        }
      } catch (e) {
        this.logger.warn(e.message);
      }

      return Promise.resolve();
    }
  }

  return EsSerivce;
};
