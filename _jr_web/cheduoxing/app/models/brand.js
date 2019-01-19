/**
 * 数据模型 - 汽车品牌
 *
 * Created by Chenjr on 2019/01/14.
 */

'use strict';

const showdown = require('showdown');
const converter = new showdown.Converter();

class MBrand {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 品牌ID
    this.name = (objMysql.name || '').trim(); // 品牌标题
    this.logo = (objMysql.logo || '').trim(); // 品牌LOGO
    this.video = (objMysql.video || '').trim(); // 视频链接
    this.territory = (objMysql.territory || '').trim(); // 品牌所属国家
    this.initials = (objMysql.initials || '').trim(); // 首字母
    this.impression = (objMysql.impression || '').trim(); // 网友印象
    this.comment = (objMysql.comment || '').trim(); // 网友评论
    this.summary = (objMysql.summary || '').trim(); // 品牌摘要
    this.content = (objMysql.content || '').trim(); // 品牌内容
    this.summaryHtml = converter.makeHtml(this.summary);
    this.contentHtml = converter.makeHtml(this.content);
    this.website = (objMysql.website || '').trim(); // 品牌官网链接
    this.count = parseInt(objMysql.count) || 0; // 访问次数
    this.status = parseInt(objMysql.status) || 0; // 状态
  }

  // 静态方法：表名
  // 调用方法：MBrand.TABLE
  static get TABLE() {
    return 'tb_brand';
  }

  to() {
    const item = {
      name: this.name,
      logo: this.logo,
      video: this.video,
      territory: this.territory,
      initials: this.initials,
      impression: this.impression,
      comment: this.comment,
      summary: this.summary,
      content: this.content,
      website: this.website,
      status: this.status,
    };

    if (this.id) {
      item.id = this.id;
    }
    
    if (this.count) {
      item.count = this.count;
    }

    return item;
  }
}

module.exports = MBrand;
