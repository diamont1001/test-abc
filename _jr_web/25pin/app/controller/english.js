/**
 * 英语频道
 */

'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.layoutRender('pages/english/index.ejs', {
      name: 'english',
      title: '轻松学英语好方法，实用英语学习资源_英语学堂_爱玩品',
      keywords: '英语,学习,方法,实用,听说读写,爱玩品',
      description: '英语，只为沟通，不为考试。拒绝死记硬背，拒绝应试教育。英语学习，其实可以很轻松。英语是一种语言，是用来表达和沟通的而不是用来考试的。就像婴儿学步，只要方法对了，它就是水到渠成的过程，一切应该是轻松和自然的。',
      canonical: this.app.config.biz.server + '/english',
    });
  }

}

module.exports = HomeController;
