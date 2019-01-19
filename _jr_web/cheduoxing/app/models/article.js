/**
 * 数据模型 - 文章article
 *
 * Created by Chenjr on 2018/08/10.
 */

'use strict';

const showdown = require('showdown');
const converter = new showdown.Converter();

class MArticle {

  constructor(objMysql = {}) {
    this.id = parseInt(objMysql.id) || 0; // 文章ID
    this.title = (objMysql.title || '').trim(); // 文章标题
    this.keywords = (objMysql.keywords || '').trim(); // 关键词
    this.summary = (objMysql.summary || '').trim(); // 文章摘要
    this.content = (objMysql.content || '').trim(); // 文章内容
    this.contentHtml = converter.makeHtml(this.content);
    this.video = (objMysql.video || '').trim(); // 视频链接
    this.author = (objMysql.author || '').trim(); // 作者
    this.createTime = objMysql.create_time || 0; // 创建时间
    this.publishTime = objMysql.publish_time; // 发布时间
    this.updateTime = objMysql.update_time || 0; // 最后更新时间
    this.updateOperator = (objMysql.update_operator || '').trim(); // 最后更新人
    this.status = parseInt(objMysql.status) || 0; // 状态（0：草稿，1：已发布，2：已下线，3：回收站，4：已删除）
    this.verifyState = parseInt(objMysql.verify_state) || 0; // 审核状态（0：待审核，1：审核通过，2：审核不通过）
    this.count = parseInt(objMysql.count) || 0; // 访问次数
    this.countShow = this.count * 131 + this.id; // 访问次数（用于显示）

    try {
      this.images = objMysql.images.split(',').filter(item => {
        return (item && item.trim());
      }).map(item => {
        return decodeURIComponent(item);
      });
    } catch (e) {
      this.images = [];
    }

    try {
      this.tags = objMysql.tags.split(',').map(item => {
        return parseInt(item) || 0;
      }).filter(item => {
        return (item);
      });
    } catch (e) {
      this.tags = [];
    }

    this.tagList = [];
  }

  // 静态方法：表名
  // 调用方法：MArticle.TABLE
  static get TABLE() {
    return 'tb_article';
  }

  static get TYPE() {
    return {
      INFO: 0, // 资讯
      BOOK_LIST: 1, // 书单
      TUTORIAL: 2, // 教程
      NEWS: 3, // 新闻
    };
  }

  addImage(url) {
    if (url) {
      this.images.push(url);
    }
  }

  to() {
    const item = {
      title: this.title,
      keywords: this.keywords,
      summary: this.summary,
      content: this.content,
      tags: this.tags.length > 0 ? this.tags.map(item => { return item; }).join(',') : '',
      images: this.images.length > 0 ? this.images.map(item => { return encodeURIComponent(item); }).join(',') : '',
      video: this.video,
      author: this.author,
      // create_time: this.createTime,
      // publish_time: this.publishTime,
      // update_time: this.updateTime,
      update_operator: this.updateOperator,
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

module.exports = MArticle;
