/**
 * 数据库帮助类 - 百科管理
 *
 * @author 材主<diamont1001@163.com> @2018.09.30
 */

'use strict';

const MBaike = require('../models/baike');
const MBaikeCate = require('../models/baikeCate');
const MBaikeSubcate = require('../models/baikeSubcate');

class DBBaikeUtils {
  constructor(app) {
    this.mysql = app.mysql; // 数据库mysql的句柄
    this.logger = app.logger;
  }

  /**
   * {Promise} 查询百科列表
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @param {String} cate 一级分类ID
   * @param {String} subcate 二级分类ID
   * @return {[MBaike]} 返回百科列表
   */
  async getList(offset = 0, count = 20, cate = 0, subcate = 0) {
    let sql = `SELECT id,title,cate,subcate FROM ${MBaike.TABLE} WHERE status=1 AND verify_state=1`;

    if (cate) {
      sql += ` and cate=${cate}`;
    }
    if (subcate) {
      sql += ` and subcate=${subcate}`;
    }
    sql += ` limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MBaike(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询百科详情
   * @param  {Nuber} id 百科ID
   * @return {[MBaike]} 返回百科详情
   */
  async getDetail(id) {
    const result = await this.mysql.get(MBaike.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MBaike(result));
    }

    return Promise.resolve();
  }

  async isExist(id) {
    const result = await this.mysql.query(
      `select id from ${MBaike.TABLE} where id = ${id};`);

    if (result && result.length > 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async addBaike(item) {
    const result = await this.mysql.insert(MBaike.TABLE, item.to());

    if (result && result.affectedRows === 1) {
      this.logger.debug('add baike success. ', item.id, item.title);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }

  /**
   * {Promise} 查询前一篇
   * @param  {Nuber} id 当前ID
   * @return {[MBaike]} 返回百科详情
   */
  async getPreDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MBaike.TABLE} where id = (select max(id) from ${MBaike.TABLE} where id < ${id} and status = 1 and verify_state = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MBaike(result[0]));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前下一篇
   * @param  {Nuber} id 当前ID
   * @return {[MBaike]} 返回百科详情
   */
  async getNextDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MBaike.TABLE} where id = (select min(id) from ${MBaike.TABLE} where id > ${id} and status = 1 and verify_state = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MBaike(result[0]));
    }

    return Promise.resolve();
  }

  // 访问一次，count 加 1
  async accessOnce(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MBaike.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access baike failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }

  // title检索文章
  async searchByTitle(key='', offset=0, count=20) {
    let sql = `SELECT id, title FROM ${MBaike.TABLE} WHERE status=1 AND verify_state=1 and title like ? ` +
      `ORDER BY id ASC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql, '%' + key + '%');

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MBaike(result[i]);
          arr.push({
            id: result[i].id,
            title: result[i].title,
          });
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /****************** cate ******************/
  async getCateList() {
    try {
      const result = await this.mysql.select(MBaikeCate.TABLE, {
        where: {
          status: 1,
        },
        orders: [[ 'weight', 'desc' ], [ 'id', 'asc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MBaikeCate(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getCate(id) {
    const result = await this.mysql.get(MBaikeCate.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MBaikeCate(result));
    }

    return Promise.resolve();
  }

  async getCateByName(name) {
    const result = await this.mysql.get(MBaikeCate.TABLE, {
      name,
    });

    if (result) {
      return Promise.resolve(new MBaikeCate(result));
    }

    return Promise.resolve();
  }

  async isCateExist(name) {
    const result = await this.mysql.query(
      `select id from ${MBaikeCate.TABLE} where name = '${name}';`);

    if (result && result.length > 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async addCate(item) {
    const isExist = await this.isCateExist(item.name);

    if (isExist) {
      // this.logger.debug('cate add failed, already exist. ', item.name);
      return;
    }

    const result = await this.mysql.insert(MBaikeCate.TABLE, item.to());

    if (result && result.affectedRows === 1) {
      this.logger.debug('add cate success. ', item.name);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }

  /****************** subcate ******************/
  async getSubcateList(cate = 0) {
    let sql = `SELECT * FROM ${MBaikeSubcate.TABLE} WHERE status=1`;

    if (cate) {
      sql += ` and cate=${cate}`;
    }
    sql += ` order by weight desc, id asc limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MBaike(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getSubcate(id) {
    const result = await this.mysql.get(MBaikeSubcate.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MBaikeSubcate(result));
    }

    return Promise.resolve();
  }

  async getSubcateByName(name) {
    const result = await this.mysql.get(MBaikeSubcate.TABLE, {
      name,
    });

    if (result) {
      return Promise.resolve(new MBaikeSubcate(result));
    }

    return Promise.resolve();
  }

  async isSubcateExist(cate = 0, name) {
    const result = await this.mysql.query(
      `select id from ${MBaikeSubcate.TABLE} where cate = ${cate} and name = '${name}';`);

    if (result && result.length > 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async addSubcate(item) {
    const isExist = await this.isSubcateExist(item.cate, item.name);

    if (isExist) {
      // this.logger.debug('subcate add failed, already exist. ', item.name);
      return;
    }

    const result = await this.mysql.insert(MBaikeSubcate.TABLE, item.to());

    if (result && result.affectedRows === 1) {
      this.logger.debug('add subcate success. ', item.name);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }
}

module.exports = DBBaikeUtils;
