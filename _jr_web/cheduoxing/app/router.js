'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 文章页
  // router.get('/article', controller.article.list);
  router.get('/article/:id', controller.article.index);

  // 帮助页面（非 SEO）
  // router.get('/about/contact', controller.about.contact);

  // API
  router.get('/api/getArticleList', controller.article.moreajax); // 文章列表页「加载更多」

  // 搜索引擎相关
  router.get('/sitemap.xml', controller.sitemap.index);
  router.get('/robots.txt', controller.sitemap.robots);
};
