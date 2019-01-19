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

  // 汽车品牌
  router.get('/brand', controller.brand.list);
  router.get('/brand/:id', controller.brand.index);

  // 帮助页面（非 SEO）
  // router.get('/about/contact', controller.about.contact);

  // API
  router.get('/api/getArticleList', controller.article.moreajax);

  // 搜索引擎相关
  router.get('/sitemap.xml', controller.sitemap.index);
  router.get('/robots.txt', controller.sitemap.robots);
};
