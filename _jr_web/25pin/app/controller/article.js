/**
 * 文章页
 */

'use strict';

const Controller = require('egg').Controller;
const Xor = require('../libs/xor');

class ArticleController extends Controller {
  async index() {
    const articleId = parseInt(this.ctx.params.id) || 0;

    if (!articleId || articleId + '' !== this.ctx.params.id) { // 防止这种情况：'/article/2p' 或者 '/article/ 2'
      this.ctx.status = 404;
      return;
    }

    const [ article, preArticle, nextArticle ] = await Promise.all([
      this.service.article.getDetail(articleId),
      this.service.article.getPreDetail(articleId),
      this.service.article.getNextDetail(articleId),
    ]);

    // this.app.logger.debug(article);

    if (!article || article.status !== 1) {
      this.ctx.status = 404;
      return;
    }

    // 访问一次，记录一下数据库
    this.service.article.accessOnce(articleId);

    const canonical = this.app.config.biz.server + '/article/' + article.id;
    const ld_json = {
      url: canonical,
      title: article.title,
      images: article.images,
      pubDate: this.ctx.helper.stampFormat2Date('Y-m-dTH:i:s', article.publishTime.getTime()),
    };

    await this.ctx.layoutRender('pages/article/index.ejs', {
      name: 'article',
      title: article.title,
      keywords: article.keywords,
      description: article.summary,
      canonical,
      breadcrumb: [{ url: '/article', name: '资讯' }],
      ld_json, // 熊掌号主页展示
      article,
      preArticle,
      nextArticle,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
      },
      encode: Xor.encode
    });
  }

  async list() {
    const curTag = parseInt(this.ctx.params.tag) || 0;

    if (this.ctx.params.tag && curTag + '' !== this.ctx.params.tag) {
      this.ctx.status = 404;
      return;
    }

    const articleList = await this.service.article.getAvailableList(0, 20, curTag);

    if (!articleList || articleList.length <= 0) {
      this.ctx.status = 404;
      return;
    }

    let canonical = this.app.config.biz.server + '/article';
    let title = '超级有趣冷知识|生活小常识|最新精彩文章';

    if (curTag) {
      canonical += '/t_' + curTag
      title = `相关资讯|最新文章推荐`;
    }

    await this.ctx.layoutRender('pages/articlelist/index.ejs', {
      name: 'articlelist',
      title,
      keywords: '文章,资讯,教程,生活小常识,有趣冷知识,爱玩品',
      description: '最新精彩文章推荐，快来看看网友们都在说些什么吧，点击有惊喜喔。爱玩品手机资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出',
      canonical,
      breadcrumb: [],
      banner: { image: 'http://img.8989118.com/attached/image/20180428/343233081-1524886038817081988.jpg', url: '/article/rank', name: '热门冷知识，精彩文章排行榜' },
      articleList,
      tag: curTag,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
      },
    });
  }

  async rank() {
    const articleList = await this.service.article.getHotList(0, 20);

    if (!articleList || articleList.length <= 0) {
      this.ctx.status = 404;
      return;
    }

    let canonical = this.app.config.biz.server + '/article';
    let title = '热门冷知识|生活小常识|精彩文章排行榜';

    await this.ctx.layoutRender('pages/articlelist/index.ejs', {
      name: 'articlelist',
      title,
      keywords: '文章,资讯,教程,生活小常识,有趣冷知识,爱玩品',
      description: '热门精彩文章、冷知识排行榜推荐，爱玩品手机资源站，为你推荐热门丰富好玩的资源，让优质资源脱颖而出。',
      canonical,
      breadcrumb: [{ url: '/article', name: '资讯' }],
      listType: 1, // 1: rank
      articleList,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
      },
    });
  }

  async moreajax() {
    const offset = parseInt(this.ctx.query.offset) || 0;
    const count = parseInt(this.ctx.query.count) || 20;
    const listtype = parseInt(this.ctx.query.listtype) || 0;
    const tag = parseInt(this.ctx.query.tag) || 0;

    if (this.ctx.params.tag && tag + '' !== this.ctx.params.tag) {
      this.ctx.status = 404;
      return;
    }

    let articleList;

    if (listtype === 1) {
      articleList = await this.service.article.getHotList(offset, count);
    } else {
      articleList = await this.service.article.getAvailableList(offset, count, tag);
    }

    if (articleList && articleList.length > 0) {
      await this.ctx.render('pages/articlelist/list.ejs', {
        articleList,
        dateFormat(date) {
          return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
        },
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = ArticleController;
