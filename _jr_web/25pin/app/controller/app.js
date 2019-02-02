'use strict';

const Controller = require('egg').Controller;
const CResourceType = require('../constant/CResourceType');
const Xor = require('../libs/xor');

class AppController extends Controller {
  async index() {
    let appDetail = null;
    // let recs = null;
    let sameDevList = null;
    let comments = null;
    let permissions = null;
    const _packageName = this.ctx.params.pname;

    // XSS 和 SQL 注入
    if (!_packageName
      || _packageName.indexOf(' ') >= 0
      || _packageName.indexOf(',') >= 0
      || _packageName.indexOf('(') >= 0
      || _packageName.indexOf(')') >= 0
      || _packageName.indexOf('<') >= 0
      || _packageName.indexOf('>') >= 0
      || _packageName.indexOf('.') < 0) {
      this.ctx.status = 404; // 错误的路由，404
      return;
    }

    try {
      appDetail = await this.service.app.getDetail(_packageName);
    } catch (e) {
      this.app.logger.error(e);
      this.ctx.status = 404;
      return;
    }

    if (!appDetail) {
      this.ctx.status = 404; // 下线状态，404
      return;
    }

    try {
      [ /* recs, */sameDevList, comments, permissions ] = await Promise.all([
        // this.service.app.getRecs(appDetail.packageName),
        this.service.app.getListSameDeveloper(appDetail.developer, appDetail.packageName),
        this.service.app.getComments(appDetail.packageName),
        this.service.app.getPermissions(appDetail.packageName),
      ]);

      // 访问一次，记录一下数据库
      this.service.app.accessOnce(appDetail.packageName);

      let title = appDetail.tkdTitle;
      if (!title) {
        if (appDetail.itunes) {
          title = `${appDetail.name}免费下载|${this.app.config.currentYear}最新版|支持安卓和苹果iOS系统`;
        } else {
          title = `${appDetail.name}安卓版免费下载|${this.app.config.currentYear}最新版更新说明`;
        }
      }
      const canonical = this.app.config.biz.server + '/app/' + this.ctx.params.pname;
      const ld_json = {
        url: canonical,
        title,
        images: appDetail.images,
        pubDate: this.ctx.helper.stampFormat2Date('Y-m-dTH:i:s', appDetail.updateTime),
      };

      // 只放一张图，因为页面上只展示2张，放3张的话会有问题
      // if (appDetail.images && appDetail.images.length > 0) {
      //   ld_json.images.push(appDetail.images[0]);
      // }

      let description = appDetail.tkdDescription;
      if (!description) {
        if (appDetail.editorRecommend) {
          description += appDetail.editorRecommend + '，';
        }
        description += appDetail.name;
        if (appDetail.versionName) {
          description += `，最新版本v${appDetail.versionName}`;
        }
        // if (appDetail.developer) {
        //   description += `，由${appDetail.developer}提供`;
        // }
        description += `，最近已有超过${appDetail.downloadsShow}人成功安装。快来看看网友们都说些什么，更多精彩评论，点击有惊喜喔喵。爱玩品资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出。`;
      }

      await this.ctx.layoutRender('pages/app/index.ejs', {
        name: 'app',
        title,
        keywords: `${appDetail.name},${appDetail.packageName},爱玩品`,
        description,
        breadcrumb: [{
          name: 'APP',
          url: '/app',
        }],
        osType: this.ctx.osType,
        canonical,
        ld_json,
        appDetail,
        // recs,
        sameDevList,
        comments,
        permissions,
        encode: Xor.encode,
      });

    } catch (e) {
      this.app.logger.error(e);
      this.ctx.status = 404;
    }
  }

  // 列表页
  async list() {
    try {
      const [ softList, gameList, developerList ] = await Promise.all([
        this.service.app.getHotList(CResourceType.soft, 0, 20),
        this.service.app.getHotList(CResourceType.game, 0, 20),
        this.service.app.getAvailableDeveloperList(0, 10),
      ]);

      await this.ctx.layoutRender('pages/applist/index.ejs', {
        name: 'applist',
        title: `${this.app.config.currentYear}游戏大全免费下载|官方软件APP下载大全`,
        keywords: '游戏,手机游戏,app,排行榜',
        description: `爱玩品手机资源站为你推荐${this.app.config.currentYear}最火手机游戏，官方软件APP排行榜下载大全，快来看看网友们最近都在玩些什么，发现更多流行游戏APP。爱玩品手机资源站，让优质资源脱颖而出。`,
        breadcrumb: [],
        canonical: this.app.config.biz.server + '/app',
        banner: { image: 'http://pic.uzzf.com/up/2018-4/201804241033004656904.png', url: '/topic/2', name: '翻译软件精选' },
        softList,
        gameList,
        developerList,
        encode: Xor.encode,
      });
    } catch (e) {
      this.app.logger.error(e);
      this.ctx.status = 404;
    }
  }

  async moreajax() {
    const offset = parseInt(this.ctx.query.offset) || 0;
    const count = parseInt(this.ctx.query.count) || 20;
    const resourceType = parseInt(this.ctx.query.resourceType) || 0;
    const list = await this.service.app.getHotList(resourceType, offset, count);

    if (list && list.length > 0) {
      await this.ctx.render('pages/applist/list.ejs', {
        list,
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = AppController;
