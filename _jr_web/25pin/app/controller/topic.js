/**
 * 专题页
 */

'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
  async index() {
    const topicId = parseInt(this.ctx.params.id) || 0;

    if (!topicId || topicId + '' !== this.ctx.params.id) { // 防止这种情况：'/topic/2p' 或者 '/topic/ 2'
      this.ctx.status = 404;
      return;
    }

    const [ topic, preTopic, nextTopic ] = await Promise.all([
      this.service.topic.getDetail(topicId),
      this.service.topic.getPreDetail(topicId),
      this.service.topic.getNextDetail(topicId),
    ]);

    // this.app.logger.debug(topic);

    if (!topic || topic.status !== 1) {
      this.ctx.status = 404;
      return;
    }

    // 访问一次，记录一下数据库
    this.service.topic.accessOnce(topicId);

    const canonical = this.app.config.biz.server + '/topic/' + topic.id;
    const ld_json = {
      url: canonical,
      title: topic.title,
      images: topic.content.images,
      pubDate: this.ctx.helper.stampFormat2Date('Y-m-dTh:m:s', topic.updateTime.getTime()),
    };

    await this.ctx.layoutRender('pages/topic/index.ejs', {
      name: 'topic',
      title: topic.title,
      keywords: topic.keywords,
      description: topic.description || topic.content.description,
      canonical,
      breadcrumb: [/* { url: '/topic', name: '专题' }*/],
      ld_json, // 熊掌号主页展示
      topic,
      preTopic,
      nextTopic,
    });
  }

  // async list() {
  //   const articleList = await this.service.topic.getAvailableList(0, 20);

  //   await this.ctx.layoutRender('pages/articlelist/index.ejs', {
  //     name: 'articlelist',
  //     title: '精彩资讯',
  //     keywords: '文章,资讯,教程,学英语,生活小常识,爱玩品',
  //     description: '最新精彩文章推荐，快来看看网友们都在说些什么吧，点击有惊喜喔。爱玩品资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出',
  //     canonical: this.app.config.biz.server + '/article',
  //     breadcrumb: [],
  //     articleList,
  //     dateFormat(date) {
  //       return this.ctx.helper.stampFormat2Date('Y-m-d h:m:s', date.getTime());
  //     },
  //   });
  // }

  // async moreajax() {
  //   const offset = parseInt(this.ctx.query.offset) || 0;
  //   const count = parseInt(this.ctx.query.count) || 20;
  //   const articleList = await this.service.topic.getAvailableList(offset, count);

  //   if (articleList && articleList.length > 0) {
  //     await this.ctx.render('pages/articlelist/list.ejs', {
  //       articleList,
  //       dateFormat(date) {
  //         return this.ctx.helper.stampFormat2Date('Y-m-d h:m:s', date.getTime());
  //       },
  //     });
  //   } else {
  //     this.ctx.status = 204; // 数据为空
  //   }
  // }
}

module.exports = TopicController;
