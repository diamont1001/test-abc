/**
 * 数据模型 - 百科一级分类
 *
 * Created by Chenjr on 2018/09/30.
 */

'use strict';

class MBaikeCate {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 标签ID
    this.name = (objMysql.name || '').trim(); // 标签名称
    this.title = (objMysql.title || '').trim(); // SEO title 标签
    this.weight = parseInt(objMysql.weight) || 0; // 权重，可用于排序
    this.count = parseInt(objMysql.count) || 0; // 访问次数
    this.status = parseInt(objMysql.status) || 1; // 状态（0：下线，1：[默认]在线）
  }

  // 静态方法：表名
  // 调用方法：MBaikeCate.TABLE
  static get TABLE() {
    return 'tb_baike_cate';
  }

  to() {
    return {
      id: this.id,
      name: this.name,
      title: this.title,
      weight: this.weight,
      count: this.count,
      status: this.status,
    };
  }
}

module.exports = MBaikeCate;
