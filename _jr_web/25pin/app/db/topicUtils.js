/**
 * 数据库帮助类 - 专题管理
 *
 * @author 材主<diamont1001@163.com> @2018.11.01
 */

'use strict';

const MTopic = require('../models/topic');

class DBTopicUtils {
  constructor(app) {
    this.mysql = app.mysql; // 数据库mysql的句柄
    this.logger = app.logger;
  }

  async getAllAvailableIds() {
    try {
      const result = await this.mysql.query(`SELECT id FROM ${MTopic.TABLE} WHERE status = 1;`);

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

  /**
   * {Promise} 查询可用的专题列表（更新时间倒序）
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @return {[MTopic]} 返回专题列表
   */
  async getAvailableList(offset = 0, count = 10) {
    try {
      const result = await this.mysql.select(MTopic.TABLE, {
        offset,
        limit: count,
        where: {
          status: 1,
        },
        orders: [[ 'publish_time', 'desc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const topic = new MTopic(result[i]);
          arr.push(topic);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询热门专题列表（访问热度倒序）
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @return {[MTopic]} 返回专题列表
   */
  async getHotList(offset = 0, count = 10) {
    try {
      const result = await this.mysql.select(MTopic.TABLE, {
        offset,
        limit: count,
        where: {
          status: 1,
        },
        orders: [[ 'count', 'desc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const topic = new MTopic(result[i]);
          arr.push(topic);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询专题详情
   * @param  {Nuber} id 专题ID
   * @return {[MTopic]} 返回专题详情
   */
  async getDetail(id) {
    const result = await this.mysql.get(MTopic.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MTopic(result));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前一篇专题
   * @param  {Nuber} id 当前专题ID
   * @return {[MTopic]} 返回专题详情
   */
  async getPreDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MTopic.TABLE} where id = (select max(id) from ${MTopic.TABLE} where id < ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MTopic(result[0]));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前下一篇专题
   * @param  {Nuber} id 当前专题ID
   * @return {[MTopic]} 返回专题详情
   */
  async getNextDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MTopic.TABLE} where id = (select min(id) from ${MTopic.TABLE} where id > ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MTopic(result[0]));
    }

    return Promise.resolve();
  }

  // 访问一次，count 加 1
  async accessOnce(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MTopic.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access topic failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }
}

module.exports = DBTopicUtils;
