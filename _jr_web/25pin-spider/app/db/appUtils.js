/**
 * 数据库帮助类 - 应用
 *
 * @author 材主<diamont1001@163.com> @2018.08.28
 */

'use strict';

const MApp = require('../models/app');

class DBGameUtils {
  constructor(app) {
    this.mysql = app.mysql;
    this.logger = app.logger;
  }

  // 获取还没数据的记录列表
  async getInitList() {
    try {
      const result = await this.mysql.select(MApp.TABLE, {
        where: {
          status: 0,
        },
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push(result[i].packageName);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 更新初始化信息
  async updateInit(item) {
    item.active(); // 把状态变为上线
    return this.update(item);
  }

  async update(item) {
    try {
      const result = await this.mysql.update(MApp.TABLE, item.to(), {
        where: {
          packageName: item.packageName,
        },
        columns: [
          'name',
          'resourceType',
          'size',
          'icon',
          'editorRecommend',
          'appDesc',
          'verDesc',
          'downloads',
          'downloadUrl',
          'video',
          'versionName',
          'minSdkVersion',
          'updateTime',
          'developer',
          'status',
          'images',
        ],
      });

      if (result && result.affectedRows === 1) {
        this.logger.debug('更新应用OK (', item.status, ') ', item.packageName);
        return Promise.resolve();
      }
      this.logger.warn(result);

    } catch (error) {
      this.logger.error(error);
    }

    return Promise.reject();
  }

  async getAllAvailableList() {
    try {
      const result = await this.mysql.select(MApp.TABLE, {
        where: {
          status: 1,
        },
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push(new MApp(result[i]));
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 查询所有上线或下线的应用{packageName, versionName, status}
  async getAllOnlineOfflineList() {
    try {
      const result = await this.mysql.query(`SELECT packageName, versionName, status FROM ${MApp.TABLE} WHERE status in (1, 2)`);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push({
            packageName: result[i].packageName,
            versionName: result[i].versionName,
            status: result[i].status,
          });
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 查询下线应用列表
  async getAllOfflinePackageNames() {
    try {
      const result = await this.mysql.query(`SELECT packageName FROM ${MApp.TABLE} WHERE status=2`);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push(result[i].packageName);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getAllOnlinePackageNames() {
    try {
      const result = await this.mysql.query(`SELECT packageName FROM ${MApp.TABLE} WHERE status=1`);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push(result[i].packageName);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 下线某个应用
  async offlineApp(packageName) {
    try {
      const result = await this.mysql.update(MApp.TABLE, { status: 2 }, {
        where: {
          packageName,
        },
      });

      if (result && result.affectedRows === 1) {
        this.logger.info('下线应用OK ', packageName);
        return Promise.resolve();
      }
      this.logger.warn(result);
    } catch (error) {
      this.logger.error(error);
    }

    this.logger.warn('下线应用失败 ', packageName);

    return Promise.reject();
  }

  // 上线某个应用
  async onlineApp(packageName) {
    try {
      const result = await this.mysql.update(MApp.TABLE, { status: 1 }, {
        where: {
          packageName,
        },
      });

      if (result && result.affectedRows === 1) {
        this.logger.info('上线应用OK ', packageName);
        return Promise.resolve();
      }
      this.logger.warn(result);
    } catch (error) {
      this.logger.error(error);
    }

    this.logger.warn('上线应用失败 ', packageName);

    return Promise.reject();
  }

}

module.exports = DBGameUtils;
