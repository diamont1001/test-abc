'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 文章页
  router.get('/article', controller.article.list);
  router.get('/article/rank', controller.article.rank);
  router.get('/article/t_:tag', controller.article.list);
  router.get('/article/:id', controller.article.index);

  // 美图页
  router.get('/photo', controller.photo.list);
  router.get('/photo/t_:tag', controller.photo.list);
  router.get('/photo/:id', controller.photo.index);

  // 应用
  router.redirect('/app', '/', 302);
  router.redirect('/app/:pname', '/', 302);

  // 应用专题
  // router.get('/topic', controller.topic.list);
  router.redirect('/topic/:id', '/', 302);

  // 开发者
  router.redirect('/developer', '/', 302);
  router.redirect('/developer/:id', '/', 302);

  // 在线小游戏
  router.get('/onlinegame/snake', controller.onlinegame.snake);

  // 帮助页面（非 SEO）
  router.get('/about/contact', controller.about.contact);

  // API
  router.get('/api/getArticleList', controller.article.moreajax); // 文章列表页「加载更多」
  router.get('/api/getPhontList', controller.photo.moreajax); // 图片列表页「加载更多」
  // router.get('/api/getAppHotList', controller.app.moreajax); // 应用列表页「加载更多」
  // router.get('/api/getAppListByDeveloper', controller.developer.moreappajax); // 开发者详情页「加载更多」
  router.get('/api/getDeveloperList', controller.developer.moreajax); // 开发者列表页「加载更多」

  // 搜索引擎相关
  router.get('/robots.txt', controller.home.robots);
  router.get('/sitemap.xml', controller.sitemap.index);
};
