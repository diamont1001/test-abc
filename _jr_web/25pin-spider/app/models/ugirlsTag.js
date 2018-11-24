/**
 * 数据模型 - 尤果网标签
 *
 * Created by Chenjr on 2018/08/15.
 */

'use strict';

class MUgirlsTag {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 标签ID
    this.name = (objMysql.name || '').trim(); // 标签名称
    this.status = parseInt(objMysql.status) || 1; // 状态（0：下线，1：[默认]在线）
  }

  // 静态方法：表名
  // 调用方法：MUgirlsTag.TABLE
  static get TABLE() {
    return 'tb_ugirls_tag';
  }

  to() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
    };
  }
}

module.exports = MUgirlsTag;
