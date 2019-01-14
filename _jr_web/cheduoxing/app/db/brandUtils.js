/**
 * 数据库帮助类 - 汽车品牌
 *
 * @author 材主<diamont1001@163.com> @2019.01.14
 */

'use strict';

const MBrand = require('../models/brand');

class DBBrandUtils {
  constructor(app) {
    this.mysql = app.mysql; // 数据库mysql的句柄
    this.logger = app.logger;
  }

  /**
   * {Promise} 查询可用的列表
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @return {[MBrand]} 返回文章列表
   */
  async getAvailableList(offset = 0, count = 10) {
    const sql = `SELECT id, name, logo, initials, count FROM ${MBrand.TABLE} WHERE status=1 ORDER BY initials asc limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const brand = new MBrand(result[i]);
          arr.push(brand);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询热门列表
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @return {[MBrand]} 返回文章列表
   */
  async getHotList(offset = 0, count = 10) {
    const sql = `SELECT id, name, logo, initials, count FROM ${MBrand.TABLE} WHERE status=1 ORDER BY count DESC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const brand = new MBrand(result[i]);
          arr.push(brand);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询详情
   * @param  {Nuber} id 品牌ID
   * @return {[MBrand]} 返回文章详情
   */
  async getDetail(id) {
    const result = await this.mysql.get(MBrand.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MBrand(result));
    }

    return Promise.resolve();
  }

  async isExist(id) {
    const result = await this.mysql.query(
      `select id from ${MBrand.TABLE} where id = ${id};`);

    if (result && result.length > 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async addBrand(item) {
    const result = await this.mysql.insert(MBrand.TABLE, item.to());

    if (result && result.affectedRows === 1) {
      this.logger.debug('add brand success. id: ', item.id);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }

  /**
   * {Promise} 查询前一个
   * @param  {Nuber} id 当前ID
   * @return {[MBrand]} 返回详情
   */
  async getPreDetail(id) {
    const result = await this.mysql.query(
      `select id, name, logo, initials, count from ${MBrand.TABLE} where id = (select max(id) from ${MBrand.TABLE} where id < ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MBrand(result[0]));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前下个
   * @param  {Nuber} id 当前ID
   * @return {[MBrand]} 返回详情
   */
  async getNextDetail(id) {
    const result = await this.mysql.query(
      `select id, name, logo, initials, count from ${MBrand.TABLE} where id = (select min(id) from ${MBrand.TABLE} where id > ${id} and status = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MBrand(result[0]));
    }

    return Promise.resolve();
  }

  // 访问一次，count 加 1
  async accessOnce(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MBrand.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access brand failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }

  /**************************** 临时处理用 ******************************/
  async updateLogo(name, logo) {
    const result = await this.mysql.query(`update ${MBrand.TABLE} set logo='${logo}' where name='${name}'`);

    if (result && result.affectedRows === 1) {
      this.logger.debug('update brand success. name: ', name);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }
}

module.exports = DBBrandUtils;
