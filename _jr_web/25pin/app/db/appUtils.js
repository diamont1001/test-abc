/**
 * 数据库帮助类 - 游戏
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

  async getDetail(packageName) {
    const result = await this.mysql.get(MApp.TABLE, {
      packageName,
    });

    if (result) {
      return Promise.resolve(new MApp(result));
    }

    return Promise.resolve();
  }

  // 查询所有应用的包名列表（用于 sitemap）
  async getAllAvailablePnames() {
    try {
      const result = await this.mysql.query(`SELECT packageName FROM ${MApp.TABLE} WHERE status = 1;`);

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

  async getAvailableList(resourceType = 0, offset = 0, count = 20) {
    try {
      const result = await this.mysql.select(MApp.TABLE, {
        offset,
        limit: count,
        where: {
          status: 1,
          resourceType,
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

  async getHotList(resourceType = 0, offset = 0, count = 20) {
    const sql = `SELECT * FROM ${MApp.TABLE} WHERE status=1 and resourceType=${resourceType} ORDER BY count DESC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

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

  // 查询相同开发商的应用列表
  async getListSameDeveloper(developer, packageName, count = 10) {
    if (!developer || !packageName) {
      return Promise.resolve([]);
    }

    const sql = `SELECT name, icon, packageName FROM ${MApp.TABLE} WHERE status=1 and packageName!='${packageName}' and developer='${developer}' ORDER BY count DESC LIMIT ${count}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        return Promise.resolve(result);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 查询开发者名下所有应用列表
  async getListByDeveloper(developer, offset = 0, count = 20) {
    if (!developer) {
      return Promise.resolve([]);
    }

    const sql = `SELECT * FROM ${MApp.TABLE} WHERE status=1 and developer='${developer}' ORDER BY count DESC LIMIT ${count} offset ${offset};`;

    try {
      const result = await this.mysql.query(sql);

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


  // 查询有两个应用以上的开发者列表
  async getAvailableDeveloperList(offset = 0, count = 20) {
    const sql = `SELECT developer, count(*) as A FROM ${MApp.TABLE} where status = 1 and developer!='' group by developer having A>1 ORDER BY A desc LIMIT ${count} offset ${offset};`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          result[i].developer && arr.push(result[i].developer);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 添加应用，待爬虫处理
  async addApp(packageName) {
    const result = await this.mysql.insert(MApp.TABLE, {
      packageName,
    });

    if (result && result.affectedRows === 1) {
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }

  // 访问一次，count 加 1
  async accessOnce(packageName) {
    try {
      const result = await this.mysql.query(`UPDATE ${MApp.TABLE} set count = (count+1) WHERE packageName = '${packageName}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access game failed. packageName:' + packageName);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }
}

module.exports = DBGameUtils;
