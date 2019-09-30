/**
 * 数据模型 - 百科
 *
 * Created by Chenjr on 2019/09/30.
 */

'use strict';

const showdown = require('showdown');
const converter = new showdown.Converter();

class MBaike {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 文章ID
    this.title = (objMysql.title || '').trim(); // 文章标题
    this.content = (objMysql.content || '').trim(); // 文章内容
    this.contentHtml = converter.makeHtml(this.content);
    this.cate = parseInt(objMysql.cate) || 0; // 一级分类ID
    this.subcate = parseInt(objMysql.subcate) || 0; // 二级分类ID
    this.source = (objMysql.source || '').trim(); // 数据来源
    this.createTime = objMysql.create_time || 0; // 创建时间
    this.publishTime = objMysql.publish_time || 0; // 发布时间
    this.updateTime = objMysql.update_time || 0; // 最后更新时间
    this.status = parseInt(objMysql.status) || 0; // 状态（0：草稿，1：已发布，2：已下线，3：回收站，4：已删除）
    this.verifyState = parseInt(objMysql.verify_state) || 0; // 审核状态（0：待审核，1：审核通过，2：审核不通过）
    this.count = parseInt(objMysql.count) || 0; // 访问次数
  }

  // 静态方法：表名
  // 调用方法：MBaike.TABLE
  static get TABLE() {
    return 'tb_baike';
  }

  to() {
    const item = {
      title: this.title,
      content: this.content,
      cate: this.cate,
      subcate: this.subcate,
      source: this.source,
      // create_time: this.createTime,
      // publish_time: this.publishTime,
      // update_time: this.updateTime,
      status: this.status,
      verify_state: this.verifyState,
      count: this.count,
    };

    if (this.id) {
      item.id = this.id;
    }

    if (this.createTime) {
      item.create_time = this.createTime;
    }

    if (this.publishTime) {
      item.publish_time = this.publishTime;
    }

    if (this.updateTime) {
      item.update_time = this.updateTime;
    }

    return item;
  }
}

module.exports = MBaike;
