/**
 * 数据库帮助类 - 尤果网美女图片
 *
 * @author 材主<diamont1001@163.com> @2018.08.16
 */

'use strict';

const MUgirls = require('../models/ugirls');
const MUgirlsTag = require('../models/ugirlsTag');

class DBArticleUtils {
  constructor(app) {
    this.mysql = app.mysql; // 数据库mysql的句柄
    this.logger = app.logger;
  }

  /**
   * {Promise} 查询可用的列表
   * @param  {Nuber} tagId 标签ID（不传代表查询所有）
   * @param  {Nuber} offset 偏移量
   * @param  {Nuber} count 查询量
   * @return {[MUgirls]} 返回列表
   */
  async getUgirlsList(tagId = 0, offset = 0, count = 20) {
    let sql = `SELECT * FROM ${MUgirls.TABLE} WHERE status=1`;

    if (tagId && tagId > 0) {
      sql += ` and FIND_IN_SET(${tagId}, tags)`;
    }
    sql += ` ORDER BY id DESC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MUgirls(result[i]);
          arr.push(article);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  // 获取所有美女ID列表（用于 sitemap）
  async getAllUgirlsIds() {
    try {
      const result = await this.mysql.query(`SELECT id FROM ${MUgirls.TABLE} WHERE status = 1;`);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push(result[i].id);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getHotUgirlsList(tagId = 0, offset = 0, count = 20) {
    let sql = `SELECT * FROM ${MUgirls.TABLE} WHERE status=1`;

    if (tagId && tagId > 0) {
      sql += ` and FIND_IN_SET(${tagId}, tags)`;
    }
    sql += ` ORDER BY count DESC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MUgirls(result[i]);
          arr.push(article);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getUgirls(id) {
    const result = await this.mysql.get(MUgirls.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MUgirls(result));
    }

    return Promise.resolve();
  }

  async addUgirls(ugirls) {
    if (!ugirls || !ugirls.id || !ugirls.name || ugirls.name.length > 20) {
      return Promise.resolve('param error');
    }

    const item = ugirls.to();

    try {
      const result = await this.mysql.query(`INSERT INTO ${MUgirls.TABLE} (id, name, avatar, description, tags, images, status) VALUES (${item.id}, '${item.name}', '${item.avatar}', '${item.description}', '${item.tags}', '${item.images}', ${item.status}) ON DUPLICATE KEY UPDATE status=1, name='${item.name}', avatar='${item.avatar}', description='${item.description}', tags='${item.tags}', images='${item.images}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('[ugirlsTypeUtils] add tag failed. name:' + item.name);
      }
      return Promise.resolve();

    } catch (e) {
      return Promise.resolve(e.message);
    }
  }

  /**
   * {Promise} 查询前一个美女
   * @param  {Nuber} id 当前美女ID
   * @return {[MUgirls]} 返回美女详情
   */
  async getPreUgirls(id) {
    const result = await this.mysql.query(
      `select * from ${MUgirls.TABLE} where id = (select max(id) from ${MUgirls.TABLE} where id < ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MUgirls(result[0]));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前下一个美女
   * @param  {Nuber} id 当前美女ID
   * @return {[MUgirls]} 返回美女详情
   */
  async getNextUgirls(id) {
    const result = await this.mysql.query(
      `select * from ${MUgirls.TABLE} where id = (select min(id) from ${MUgirls.TABLE} where id > ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MUgirls(result[0]));
    }

    return Promise.resolve();
  }

  // 访问一次，count 加 1
  async accessOnceUgirls(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MUgirls.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access ugirls failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }


  // /////////////////tag////////////////////


  async getTagsList() {
    try {
      const result = await this.mysql.select(MUgirlsTag.TABLE, {
        // offset: 0,
        // limit: 100,
        where: {
          status: 1,
        },
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MUgirlsTag(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getTag(id) {
    const result = await this.mysql.get(MUgirlsTag.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MUgirlsTag(result));
    }

    return Promise.resolve();
  }

  async getTags(ids) {
    try {
      const strIds = ids.join(',');
      const result = await this.mysql.query(`SELECT * FROM ${MUgirlsTag.TABLE} WHERE id in(${strIds});`);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MUgirlsTag(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }

    return Promise.resolve([]);
  }

  // 添加 TAG
  async addTag(item) {
    if (!item || !item.id || !item.name || item.name.length > 20) {
      return Promise.resolve('param error');
    }

    try {
      const result = await this.mysql.query(`INSERT INTO ${MUgirlsTag.TABLE} (id, name, status) VALUES (${item.id}, '${item.name}', ${item.status}) ON DUPLICATE KEY UPDATE status=1, name='${item.name}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('[ugirlsTypeUtils] add tag failed. name:' + item.name);
      }
      return Promise.resolve();

    } catch (e) {
      return Promise.resolve(e.message);
    }
  }

  // 访问一次，count 加 1
  async accessOnceTag(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MUgirlsTag.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access tag failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }
}

module.exports = DBArticleUtils;
