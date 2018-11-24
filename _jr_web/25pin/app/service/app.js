/**
 * 游戏
 */

'use strict';

const { JSDOM } = require('jsdom');
const rp = require('request-promise');
const MApp = require('../models/app');
const DBAppUtils = require('../db/appUtils');

module.exports = app => {

  class AppsSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbAppUtils = new DBAppUtils(app);
    }

    async getDetail(packageName) {
      const appItem = await this.dbAppUtils.getDetail(packageName);

      if (!appItem || appItem.status !== 1) {
        if (appItem && appItem.status === 2) {
          this.app.logger.debug('应用已下线', packageName);
          return Promise.reject('应用已下线');
        } else if (appItem && appItem.status === 3) {
          this.app.logger.debug('应用已被回收', packageName);
          return Promise.reject('应用已被回收');
        }

        try {
          // 先爬虫看看是否真的应用
          const item = await this.getDetailFromWeb(packageName);

          if (item && item.downloadUrl) {
            if (!appItem) {
              this.app.logger.debug('应用存在但不在库里，先记录并返回临时数据', packageName);
              this.dbAppUtils.addApp(packageName);
            } else {
              this.app.logger.debug('应用已存在库里，但是状态不对，先返回临时数据', packageName);
            }

            return Promise.resolve(item);
          }
        } catch (e) {
          this.app.logger.debug('应用不存在，不作记录', packageName);
          return Promise.reject('应用不存在，不作记录');
        }

        return Promise.reject();
      }

      return Promise.resolve(appItem);
    }

    // 本库记录没有时，找网上的
    async getDetailFromWeb(packageName) {
      const result = await rp({
        method: 'POST',
        uri: 'https://server-m.pp.cn/api/resource.app.getDetailByPackageName',
        json: true,
        headers: {
          referer: 'm.wandoujia.com',
          userAgent: this.app.config.spider.ua,
        },
        form: {
          packageName,
        },
      });

      if (result && result.data && result.data.app) {
        const item = new MApp(result.data.app);
        return Promise.resolve(item);
      }
      return Promise.reject(result.state);
    }

    // 查询相同公司名下的其他应用列表，最多查10个
    async getListSameDeveloper(developer, packageName) {
      return this.dbAppUtils.getListSameDeveloper(developer, packageName, 4);
    }

    async getListByDeveloper(developer, offset = 0, count = 20) {
      return this.dbAppUtils.getListByDeveloper(developer, offset, count);
    }

    async getAvailableDeveloperList(offset = 0, count = 20) {
      return this.dbAppUtils.getAvailableDeveloperList(offset, count);
    }

    // 相关推荐
    async getRecs(packageName) {
      const timeNow = Date.now();
      const recs = [];

      try {
        const result = await this.app.curl(`https://m.wandoujia.com/apps/${packageName}`, {
          headers: {
            'User-Agent': this.app.config.spider.ua,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 800,
        });

        if (result && result.status === 200) {
          const dom = new JSDOM(result.data);
          const handles = dom.window.document.querySelectorAll('.download-rank .new-app');

          if (handles && handles.length > 0) {
            Object.getOwnPropertyNames(handles).forEach(index => { // eslint-disable-line no-loop-func
              const item = {
                name: handles[index].querySelector('.d-btn.i-source').getAttribute('data-app-name'),
                packageName: handles[index].querySelector('.d-btn.i-source').getAttribute('data-app-pname'),
                icon: handles[index].querySelector('.icon').getAttribute('src'),
              };
              item.url = '/app/' + item.packageName;
              if (item.packageName) {
                recs.push(item);
              }
            });
          }
        }
      } catch (e) {
        this.app.logger.debug('[getRecs] failed. cost time: ', Date.now() - timeNow, 'ms');
        // this.app.logger.warn(e);
      }

      this.app.logger.debug('[getRecs] cost time: ', Date.now() - timeNow, 'ms');

      return Promise.resolve(recs);
    }

    // 评论数据
    async getComments(packageName) {
      const timeNow = Date.now();
      const comments = [];

      try {
        const result = await this.app.curl(`https://muzhiwan.com/${packageName}.html`, {
          headers: {
            'User-Agent': this.app.config.spider.ua_pc,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 800,
        });

        if (result && result.status === 200) {
          const dom = new JSDOM(result.data);
          const handles = dom.window.document.querySelectorAll('.inner-content');

          if (handles && handles.length > 0) {
            Object.getOwnPropertyNames(handles).forEach(index => { // eslint-disable-line no-loop-func
              const item = {
                from: '拇指玩',
                user: handles[index].querySelector('.com-user-name').textContent,
                date: handles[index].querySelector('.com-data').textContent,
                content: handles[index].querySelector('.com-user-text').textContent,
              };

              comments.push(item);
            });

            comments.shift(); // 去掉第一个
          }
        }
      } catch (e) {
        this.app.logger.debug('[getComments] failed. cost time: ', Date.now() - timeNow, 'ms');
        // this.app.logger.warn(e);
      }

      this.app.logger.debug('[getComments] cost time: ', Date.now() - timeNow, 'ms');

      return Promise.resolve(comments);
    }

    // 权限列表
    async getPermissions(packageName) {
      const timeNow = Date.now();
      try {
        const result = await this.app.curl(`http://www.appchina.com/app/${packageName}`, {
          headers: {
            'User-Agent': this.app.config.spider.ua_pc,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 800,
        });

        if (result && result.status === 200) {
          const dom = new JSDOM(result.data);
          const permissions = dom.window.document.querySelector('.permissions-list').innerHTML;

          this.app.logger.debug('[getPermissions] ok. cost time: ', Date.now() - timeNow, 'ms');

          return Promise.resolve(permissions);
        }
      } catch (e) {
        // this.app.logger.warn(e);
      }

      this.app.logger.debug('[getPermissions] failed. cost time: ', Date.now() - timeNow, 'ms');

      return Promise.resolve();
    }

    async accessOnce(packageName) {
      return this.dbAppUtils.accessOnce(packageName);
    }

    async getAvailableList(resourceType = 0, offset = 0, count = 20) {
      return this.dbAppUtils.getAvailableList(resourceType, offset, count);
    }

    async getAllAvailablePnames() {
      return this.dbAppUtils.getAllAvailablePnames();
    }

    async getHotList(resourceType = 0, offset = 0, count = 20) {
      return this.dbAppUtils.getHotList(resourceType, offset, count);
    }
  }

  return AppsSerivce;
};
