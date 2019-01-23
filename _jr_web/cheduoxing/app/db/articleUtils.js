/**
 * 数据库帮助类 - 文章管理
 *
 * @author 材主<diamont1001@163.com> @2018.08.10
 */

'use strict';

const MArticle = require('../models/article');
const MArticleTag = require('../models/articleTag');

class DBArticleUtils {
  constructor(app) {
    this.mysql = app.mysql; // 数据库mysql的句柄
    this.logger = app.logger;
  }

  async getSitemap() {
    let sql = `SELECT id FROM ${MArticle.TABLE} WHERE status=1 AND verify_state=1`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          arr.push('/article/' + result[i].id);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询可用的文章列表
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @param {String} tag 标签
   * @return {[MArticle]} 返回文章列表
   */
  async getAvailableList(offset = 0, count = 10, tag) {
    let sql = `SELECT * FROM ${MArticle.TABLE} WHERE status=1 AND verify_state=1`;

    if (tag) {
      sql += ` and FIND_IN_SET("${tag}", tags)`;
    }
    sql += ` ORDER BY publish_time DESC limit ${count} offset ${offset}`;

    try {
      const result = await this.mysql.query(sql);

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MArticle(result[i]);
          arr.push(article);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询热门文章列表
   * @param {Number} offset 请求列表偏移量
   * @param {Number} count 请求数量
   * @return {[MArticle]} 返回文章列表
   */
  async getHotList(offset = 0, count = 10) {
    try {
      const result = await this.mysql.select(MArticle.TABLE, {
        offset,
        limit: count,
        columns: [ 'id', 'title', 'images', 'count', 'tags' ],
        where: {
          status: 1,
          verify_state: 1,
        },
        orders: [[ 'count', 'desc' ], [ 'id', 'desc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MArticle(result[i]);
          arr.push(article);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  async getNewList(offset = 0, count = 10) {
    try {
      const result = await this.mysql.select(MArticle.TABLE, {
        offset,
        limit: count,
        columns: [ 'id', 'title', 'images', 'count', 'tags' ],
        where: {
          status: 1,
          verify_state: 1,
        },
        orders: [[ 'publish_time', 'desc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const article = new MArticle(result[i]);
          arr.push(article);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }

  /**
   * {Promise} 查询文章详情
   * @param  {Nuber} id 文章ID
   * @return {[MArticle]} 返回文章详情
   */
  async getDetail(id) {
    const result = await this.mysql.get(MArticle.TABLE, {
      id,
    });

    if (result) {
      return Promise.resolve(new MArticle(result));
    }

    return Promise.resolve();
  }

  async isExist(id) {
    const result = await this.mysql.query(
      `select id from ${MArticle.TABLE} where id = ${id};`);

    if (result && result.length > 0) {
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async addArticle(article) {
    const result = await this.mysql.insert(MArticle.TABLE, article.to());

    if (result && result.affectedRows === 1) {
      this.logger.debug('add article success. id: ', article.id);
      return Promise.resolve();
    }

    return Promise.resolve(result);
  }

  /**
   * {Promise} 查询前一篇文章
   * @param  {Nuber} id 当前文章ID
   * @return {[MArticle]} 返回文章详情
   */
  async getPreDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MArticle.TABLE} where id = (select max(id) from ${MArticle.TABLE} where id < ${id} and status = 1 and verify_state = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MArticle(result[0]));
    }

    return Promise.resolve();
  }

  /**
   * {Promise} 查询前下一篇文章
   * @param  {Nuber} id 当前文章ID
   * @return {[MArticle]} 返回文章详情
   */
  async getNextDetail(id) {
    const result = await this.mysql.query(
      `select * from ${MArticle.TABLE} where id = (select min(id) from ${MArticle.TABLE} where id > ${id} and status = 1 and verify_state = 1);`);

    if (result && result.length > 0) {
      return Promise.resolve(new MArticle(result[0]));
    }

    return Promise.resolve();
  }

  // 访问一次，count 加 1
  async accessOnce(id) {
    try {
      const result = await this.mysql.query(`UPDATE ${MArticle.TABLE} set count = (count+1) WHERE id = '${id}';`);
      if (result.affectedRows < 1) {
        return Promise.resolve('access article failed. id:' + id);
      }
      return Promise.resolve();
    } catch (e) {
      this.logger.warn(e);
      return Promise.resolve(e.message);
    }
  }


  /****************** tag ******************/
  async getTagList() {
    try {
      const result = await this.mysql.select(MArticleTag.TABLE, {
        where: {
          status: 1,
        },
        orders: [[ 'weight', 'desc' ], [ 'id', 'asc' ]],
      });

      if (result && result.length > 0) {
        const arr = [];
        for (let i = 0; i < result.length; i++) {
          const item = new MArticleTag(result[i]);
          arr.push(item);
        }
        return Promise.resolve(arr);
      }
    } catch (error) {
      this.logger.error(error);
    }
    return Promise.resolve([]);
  }
}

module.exports = DBArticleUtils;
