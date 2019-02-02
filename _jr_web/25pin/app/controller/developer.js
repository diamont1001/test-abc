/**
 * 开发者专题
 */

'use strict';

const Controller = require('egg').Controller;
const Xor = require('../libs/xor');
const COUNT = 20; // 一次显示的应用数

class DeveloperController extends Controller {
  async index() {
    const devId = this.ctx.params.id;

    // XSS 和 SQL 注入
    if (!devId
      || devId.indexOf(' ') >= 0
      || devId.indexOf(',') >= 0
      || devId.indexOf('(') >= 0
      || devId.indexOf(')') >= 0
      || devId.indexOf('<') >= 0
      || devId.indexOf('>') >= 0) {
      this.ctx.status = 404; // 错误的路由，404
      return;
    }

    // 解密
    const developer = Xor.decode(devId);

    if (!developer
      || developer.indexOf('<') >= 0
      || developer.indexOf('>') >= 0) {
      this.ctx.status = 404; // 错误的路由，404
      return;
    }

    const appList = await this.service.app.getListByDeveloper(developer, 0, COUNT);

    if (!appList || appList.length <= 0) {
      this.ctx.status = 404;
      return;
    }

    const locals = {
      name: 'developer',
      title: `${developer}APP大全`,
      keywords: `${developer},APP大全,应用合集,爱玩品`,
      description: `${developer}的APP合集，每天更新。爱玩品手机资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出`,
      breadcrumb: [{ name: '开发者', url: '/developer' }],
      canonical: this.app.config.biz.server + '/developer/' + Xor.encode(developer),
      developer,
      appList,
    };

    await this.ctx.layoutRender('pages/developer/index.ejs', locals);
  }

  // 加载更多应用
  async moreappajax() {
    const devId = this.ctx.query.id;
    const offset = parseInt(this.ctx.query.offset) || 0;

    // XSS 和 SQL 注入
    if (!devId
      || devId.indexOf('<') >= 0
      || devId.indexOf('>') >= 0) {
      this.ctx.status = 404; // 错误的路由，404
      return;
    }

    const appList = await this.service.app.getListByDeveloper(devId, offset, COUNT);

    if (appList && appList.length > 0) {
      await this.ctx.render('pages/applist/list.ejs', {
        list: appList,
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }

  async list() {
    const developerList = await this.service.app.getAvailableDeveloperList(0, COUNT);

    if (!developerList || developerList.length <= 0) {
      this.ctx.status = 404;
      return;
    }

    const locals = {
      name: 'developerlist',
      title: '手机APP开发者大全',
      keywords: '手机APP开发者大全,爱玩品',
      description: '爱玩品手机资源站为你提供所有的手机APP开发者大全，让你可以通过开发者，发现想要的应用和资讯。爱玩品资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出',
      breadcrumb: [{ name: 'APP', url: '/app' }],
      canonical: this.app.config.biz.server + '/developer',
      developerList,
      encode: Xor.encode,
    };

    await this.ctx.layoutRender('pages/developerlist/index.ejs', locals);
  }

  // 加载更多开发者
  async moreajax() {
    const offset = parseInt(this.ctx.query.offset) || 0;

    const list = await this.service.app.getAvailableDeveloperList(offset, COUNT);

    if (list && list.length > 0) {
      await this.ctx.render('pages/developerlist/list.ejs', {
        list,
        encode: Xor.encode,
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = DeveloperController;
