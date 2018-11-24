/**
 * 数据模型 - 专题topic
 *
 * Created by Chenjr on 2018/08/10.
 */

'use strict';

class MTopic {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 专题ID
    this.title = (objMysql.title || '').trim(); // TKD: title
    this.keywords = (objMysql.keywords || '').trim(); // TKD: keywords
    this.description = (objMysql.description || '').trim(); // TKD: description
    this.createTime = objMysql.create_time || 0; // 创建时间
    this.updateTime = objMysql.update_time || 0; // 最后更新时间
    this.status = parseInt(objMysql.status) || 0; // 状态（0：草稿，1：已发布，2：已下线）
    this.count = parseInt(objMysql.count) || 0; // 访问次数

    try {
      this.content = JSON.parse(objMysql.content);
    } catch (e) {
      this.content = null;
    }
  }

  // 静态方法：表名
  // 调用方法：MTopic.TABLE
  static get TABLE() {
    return 'tb_app_topic';
  }

  to() {
    return {
      id: this.id,
      title: this.title,
      keywords: this.keywords,
      description: this.description,
      content: this.content ? JSON.stringify(this.content) : '',
      create_time: this.createTime,
      update_time: this.updateTime,
      status: this.status,
      count: this.count,
    };
  }
}

module.exports = MTopic;
