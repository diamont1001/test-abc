/**
 * 美图页
 */

'use strict';

const Controller = require('egg').Controller;

class PhotoController extends Controller {
  async index() {
    const ugirlsId = parseInt(this.ctx.params.id) || 0;

    if (!ugirlsId || ugirlsId + '' !== this.ctx.params.id) {
      this.ctx.status = 404;
      return;
    }

    const [ ugirls, preUgirls, nextUgirls ] = await Promise.all([
      this.service.ugirls.getUgirls(ugirlsId),
      this.service.ugirls.getPreUgirls(ugirlsId),
      this.service.ugirls.getNextUgirls(ugirlsId),
    ]);

    // this.app.logger.debug(ugirls);

    if (!ugirls) {
      this.ctx.status = 404;
      return;
    }

    // 访问一次，记录一下数据库
    this.service.ugirls.accessOnceUgirls(ugirlsId);

    const tagsList = await this.service.ugirls.getTags(ugirls.tags);
    const keywords = tagsList.map(tag => { return tag.name; }).join(',');
    let title = '美女' + ugirls.name + '人体写真';

    if (tagsList.length > 0) {
      title += '|' + tagsList[tagsList.length - 1].name;
    }
    if (tagsList.length > 1) {
      title += ',' + tagsList[tagsList.length - 2].name;
    }

    const canonical = this.app.config.biz.server + '/photo/' + ugirls.id;
    const ld_json = {
      url: canonical,
      title,
      images: ugirls.images,
      pubDate: this.ctx.helper.stampFormat2Date('Y-m-dTH:i:s', ugirls.createTime.getTime()),
    };

    await this.ctx.layoutRender('pages/photo/index.ejs', {
      name: 'photo',
      title,
      keywords,
      description: ugirls.description,
      canonical: this.app.config.biz.server + '/photo/' + ugirls.id,
      breadcrumb: [{ url: '/photo', name: '美女写真' }],
      ld_json,
      ugirls,
      preUgirls,
      nextUgirls,
      tagsList,
    });
  }

  async list() {
    const curTag = parseInt(this.ctx.params.tag) || 0;

    if (this.ctx.params.tag && curTag + '' !== this.ctx.params.tag) {
      this.ctx.status = 404;
      return;
    }

    const [ ugirlsList, tagsList, tagDetail ] = await Promise.all([
      this.service.ugirls.getUgirlsList(curTag),
      this.service.ugirls.getTagsList(),
      this.service.ugirls.getTag(curTag),
    ]);

    // 把当前tag放到前面
    for (let i = 0; i < tagsList.length; i++) {
      if (tagsList[i].id === curTag) {
        // 把该元素放到前面第一位
        const item = tagsList.splice(i, 1)[0];
        tagsList.unshift(item);
        break;
      }
    }

    if (curTag) {
      // 访问一次，记录一下数据库
      this.service.ugirls.accessOnceTag(curTag);
    }

    const locals = {
      name: 'photolist',
      title: '美女写真大全|宅男福利',
      keywords: '美图,美女写真,美女图片,写真集,尤果网,爱玩品',
      description: '尤果网美女写真集免费看，美女图片，宅男福利。爱玩品资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出。',
      breadcrumb: curTag === 0 ? [] : [{ name: '美女写真', url: '/photo' }],
      curTag,
      tagsList,
      ugirlsList,
    };

    if (tagDetail) {
      locals.title = tagDetail.name + locals.title;
      locals.keywords = tagDetail.name + ',' + locals.keywords;
    }

    if (!curTag) {
      locals.canonical = this.app.config.biz.server + '/photo';
    } else {
      locals.canonical = this.app.config.biz.server + '/photo/t_' + curTag;
    }

    if (ugirlsList && ugirlsList[0] && ugirlsList[0].avatar) {
      locals.ld_json = {
        url: locals.canonical,
        title: locals.title,
        images: [ ugirlsList[0].avatar ],
        pubDate: this.ctx.helper.stampFormat2Date('Y-m-dTH:i:s', ugirlsList[0].createTime.getTime()),
      };
    }

    await this.ctx.layoutRender('pages/photolist/index.ejs', locals);
  }

  async moreajax() {
    const tag = parseInt(this.ctx.query.tag) || 0;
    const offset = parseInt(this.ctx.query.offset) || 0;
    const count = parseInt(this.ctx.query.count) || 20;
    const ugirlsList = await this.service.ugirls.getUgirlsList(tag, offset, count);

    if (ugirlsList && ugirlsList.length > 0) {
      await this.ctx.render('pages/photolist/list.ejs', {
        ugirlsList,
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = PhotoController;
