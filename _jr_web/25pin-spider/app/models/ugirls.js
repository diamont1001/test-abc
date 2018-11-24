/**
 * 数据模型 - 尤果网美女
 *
 * Created by Chenjr on 2018/08/15.
 */

'use strict';

class MUgirls {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // ID
    this.name = (objMysql.name || '').trim(); // 名称
    this.avatar = decodeURIComponent((objMysql.avatar || '').trim()); // 头像
    this.description = (objMysql.description || '').trim(); // 描述
    this.status = parseInt(objMysql.status) || 1; // 状态（0：下线，1：[默认]在线）

    try {
      this.tags = objMysql.tags.split(',').map(item => {
        return parseInt(item);
      });
    } catch (e) {
      this.tags = [];
    }

    try {
      this.images = objMysql.images.split(',').filter(item => {
        return (item && item.trim());
      }).map(item => {
        return decodeURIComponent(item);
      });
    } catch (e) {
      this.images = [];
    }
  }

  // 静态方法：表名
  // 调用方法：MUgirls.TABLE
  static get TABLE() {
    return 'tb_ugirls';
  }

  addTag(tagId) {
    if (tagId) {
      this.tags.push(tagId);
    }
  }

  addImage(url) {
    if (url) {
      this.images.push(url);
    }
  }

  to() {
    return {
      id: this.id,
      name: this.name,
      avatar: encodeURIComponent(this.avatar),
      description: this.description,
      images: this.images.length > 0 ? this.images.map(item => { return encodeURIComponent(item); }).join(',') : '',
      tags: this.tags.length > 0 ? this.tags.join(',') : '',
      status: this.status,
    };
  }
}

module.exports = MUgirls;
