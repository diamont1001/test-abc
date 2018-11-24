/**
 * 游戏
 */

'use strict';

const { JSDOM } = require('jsdom');
const rp = require('request-promise');
const MApp = require('../models/app');
const DBAppUtils = require('../db/appUtils');
const compareVersions = require('semver-compare');

module.exports = app => {

  class AppSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbAppUtils = new DBAppUtils(app);
    }

    // 更新新入库应用信息
    async runUpdateNewApps() {
      this.logger.info('「更新新入库应用」run() start.');

      const taskList = await this.getTask();
      await this.updateApp(taskList);

      this.logger.info('「更新新入库应用」run() end.');
    }

    // STEP 1: 查询已入库但无数据的列表
    async getTask() {
      return this.dbAppUtils.getInitList();
    }

    // STEP 2: 根据 task 去爬取数据并写到数据库
    async updateApp(list) {
      if (!list || list.length <= 0) {
        return Promise.resolve('[updateApp] task empty.');
      }

      for (let i = 0; i < list.length; i++) {
        try {
          const detail = await this.getDetail(list[i]);
          await this.dbAppUtils.updateInit(detail);
        } catch (e) {
          this.app.logger.warn(e);
          await this.dbAppUtils.offlineApp(list[i]);
        }
      }

      return Promise.resolve();
    }

    // 探索新应用
    async runDetectNewApps() {
      this.app.logger.info('「探索新应用」start.');
      try {
        const res = await this.app.curl('https://www.wandoujia.com/apps', {
          headers: {
            'User-Agent': this.app.config.spider.ua_pc,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 8000,
        });

        if (res && res.status === 200) {
          const dom = new JSDOM(res.data);

          try {
            const handles = dom.window.document.querySelectorAll('.note-worthy .card');
            if (handles && handles.length > 0) {
              Object.getOwnPropertyNames(handles).forEach(index => { // eslint-disable-line no-loop-func
                const pn = handles[index].getAttribute('data-pn');
                if (pn) {
                  this.app.logger.debug('「探索新应用」尝试访问应用：', pn);
                  this.app.curl(`http://www.25pin.com/app/${pn}`); // 异步去访问新链接，让服务器生成新应用链接
                }
              });
            }
          } catch (e) {
            this.app.logger.warn(e);
          }
        }
      } catch (e) {
        this.app.logger.warn(e);
      }
      this.app.logger.info('「探索新应用」end.');
    }


    // 检查应用，更新信息
    async runCheckApps() {
      this.app.logger.info('「检查应用」start.');

      const now = Date.now();
      const list = await this.dbAppUtils.getAllOnlineOfflineList();

      this.app.logger.info('「检查应用」查询所有上线|下线的应用完成，应用个数：' + list.length + '，花费时间：' + (Date.now() - now) + 'ms');

      for (let i = 0; i < list.length; i++) {
        const item = list[i];

        try {
          const appDetail = await this.getAppBaseInfo(item.packageName);

          if (appDetail && appDetail.name) {
            if (compareVersions(appDetail.versionName, item.versionName) > 0) {
              this.app.logger.debug('「检查应用」应用需要更新，原版本号：', item.versionName, ', 现版本号：', appDetail.versionName);

              const appItem = await this.getAppMoreInfo(appDetail, item.packageName);
              await this.dbAppUtils.updateInit(appItem);

              this.app.logger.info('「检查应用」更新应用OK', appItem.packageName, appItem.versionName);
            } else {
              this.app.logger.debug('「检查应用」应用不需要更新', item.packageName, item.versionName);
            }

            if (item.status === 2) {
              await this.dbAppUtils.onlineApp(item.packageName);
            }
          } else {
            this.app.logger.debug('「检查应用」网络查询应用成功，但信息为空', item.packageName);

            await this.dbAppUtils.offlineApp(item.packageName);
          }
        } catch (e) {
          this.app.logger.debug('「检查应用」网络查询应用信息失败', item.packageName);
          this.app.logger.debug(e);

          // 下线或者不存在应用
          if (e && e.code && e.code >= 5010000 && e.code < 5020000) {
            await this.dbAppUtils.offlineApp(item.packageName);
          }
        }
      }

      this.app.logger.info('「检查应用」end.');
    }

    async checkApp(packageName) {
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
        return Promise.resolve();
      }

      this.app.logger.debug('应用已下线', packageName);

      return Promise.reject();
    }

    // 获取应用基本信息
    async getAppBaseInfo(packageName) {
      try {
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
            flags: 6400,
            associateFix: true,
            obsoleteFix: true,
          },
        });

        if (result && result.data && result.data.app) {
          const item = new MApp(result.data.app);

          return Promise.resolve(item);
        }
        return Promise.reject(result.state);
      } catch (e) {
        this.app.logger.debug(e);
        return Promise.reject(e);
      }
    }

    async getAppMoreInfo(objApp, packageName) {
      try {
        const res = await this.app.curl(`https://m.wandoujia.com/apps/${packageName}`, {
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
            if (dom.window.document.querySelector('.video')) {
              objApp.video = dom.window.document.querySelector('.video').getAttribute('src');
            }
          } catch (e) {
            this.app.logger.debug(e);
          }

          // 屏幕截图
          try {
            const screenshot = dom.window.document.querySelectorAll('.screenshot .overview .screenshot-img');
            if (screenshot && screenshot.length > 0) {
              Object.getOwnPropertyNames(screenshot).forEach(index => { // eslint-disable-line no-loop-func
                const image = screenshot[index].getAttribute('src');

                if (image) {
                  objApp.images.push(image);
                }
              });
            }
          } catch (e) {
            this.app.logger.debug(e);
          }
        }
      } catch (e) {
        this.app.logger.debug(e);
      }
      return objApp;
    }

    async getDetail(packageName) {
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

        // 抓取视频等其他信息
        try {
          const res = await this.app.curl(`https://m.wandoujia.com/apps/${packageName}`, {
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
              if (dom.window.document.querySelector('.video')) {
                item.video = dom.window.document.querySelector('.video').getAttribute('src');
              }
            } catch (e) {
              this.app.logger.debug(e);
            }

            // 屏幕截图
            try {
              const screenshot = dom.window.document.querySelectorAll('.screenshot .overview .screenshot-img');
              if (screenshot && screenshot.length > 0) {
                Object.getOwnPropertyNames(screenshot).forEach(index => { // eslint-disable-line no-loop-func
                  const image = screenshot[index].getAttribute('src');

                  if (image) {
                    item.images.push(image);
                  }
                });
              }
            } catch (e) {
              this.app.logger.debug(e);
            }
          }
        } catch (e) {
          this.app.logger.debug(e);
        }

        return Promise.resolve(item);
      }
      return Promise.reject(result.state);
    }
  }

  return AppSerivce;
};
