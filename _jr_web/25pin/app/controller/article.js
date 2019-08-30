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
      breadcrumb: [{ url: '/article', name: '知识' }],
      ld_json, // 熊掌号主页展示
      article,
      preArticle,
      nextArticle,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d H:i:s', date.getTime());
      },
      encode: Xor.encode,
      deviceType: this.ctx.deviceType,
    });
  }

  async list() {
    const curTagId = parseInt(this.ctx.params.tag) || 0;

    if (this.ctx.params.tag && curTagId + '' !== this.ctx.params.tag) {
      this.ctx.status = 404;
      return;
    }

    const [ tag, tagsList, articleList ] = await Promise.all([
      this.ctx.service.article.getTag(curTagId),
      this.ctx.service.article.getTagList(),
      this.service.article.getAvailableList(0, 20, curTagId),
    ]);

    if (!articleList) {
      this.ctx.status = 404;
      return;
    }

    let canonical = this.app.config.biz.server + '/article';
    let title = '最新有趣冷知识、生活小常识_瓶子老师学习网';

    if (curTagId) {
      canonical += '/t_' + curTagId;
    }

    if (tag && tag.title) {
      title = tag.title;
    } else if (tag && tag.name) {
      title = tag.name + '_' + title;
    }

    await this.ctx.layoutRender('pages/articlelist/index.ejs', {
      name: 'articlelist',
      title,
      // description: '爱生活爱学习，跟着瓶子老师一起学习有趣的冷知识、生活小常识、文化、历史、地理、英语、科学,母婴等热门小知识。',
      canonical,
      articleList,
      curTagId,
      tagsList,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d', date.getTime());
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
    let title = '有趣冷知识、生活小常识_热门排行榜';

    await this.ctx.layoutRender('pages/articlelist/index.ejs', {
      name: 'articlelist',
      title,
      canonical,
      breadcrumb: [{ url: '/article', name: '知识' }],
      listType: 1, // 1: rank
      articleList,
      dateFormat(date) {
        return this.ctx.helper.stampFormat2Date('Y-m-d', date.getTime());
      },
    });
  }

  async moreajax() {
    const offset = parseInt(this.ctx.query.offset) || 0;
    const count = parseInt(this.ctx.query.count) || 20;
    const listType = parseInt(this.ctx.query.listtype) || 0;
    const tagId = parseInt(this.ctx.query.tag) || 0;

    if (this.ctx.params.tag && tagId + '' !== this.ctx.params.tag) {
      this.ctx.status = 404;
      return;
    }

    let articleList;

    if (listType === 1) {
      articleList = await this.service.article.getHotList(offset, count);
    } else {
      articleList = await this.service.article.getAvailableList(offset, count, tagId);
    }

    if (articleList && articleList.length > 0) {
      await this.ctx.render('pages/articlelist/list.ejs', {
        articleList,
        listType,
        dateFormat(date) {
          return this.ctx.helper.stampFormat2Date('Y-m-d', date.getTime());
        },
      });
    } else {
      this.ctx.status = 204; // 数据为空
    }
  }
}

module.exports = ArticleController;
