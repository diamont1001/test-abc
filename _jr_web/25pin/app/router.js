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
  // router.get('/photo', controller.photo.list);
  // router.get('/photo/t_:tag', controller.photo.list);
  // router.get('/photo/:id', controller.photo.index);
  router.redirect('/photo', '/', 302);
  router.redirect('/photo/t_:tag', '/', 302);
  router.redirect('/photo/:id', '/', 302);

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

  // 搜索页
  router.get('/search', controller.search.index);

  // API
  router.get('/api/getArticleList', controller.article.moreajax); // 文章列表页「加载更多」
  router.get('/api/getPhontList', controller.photo.moreajax); // 图片列表页「加载更多」
  // router.get('/api/getAppHotList', controller.app.moreajax); // 应用列表页「加载更多」
  // router.get('/api/getAppListByDeveloper', controller.developer.moreappajax); // 开发者详情页「加载更多」
  // router.get('/api/getDeveloperList', controller.developer.moreajax); // 开发者列表页「加载更多」
  router.get('/api/getSearch', controller.search.searchajax); // 搜索

  // client api
  router.post('/client/article.list', controller.client.articleList); // 文章列表查询接口
  router.post('/client/article.detail', controller.client.articleDetail); // 文章详情接口
  router.post('/client/article.search', controller.client.articleSearch); // 文章搜索接口
  router.post('/client/article.tag.list', controller.client.tagList); // 文章标签列表接口
  router.post('/client/baike.cate.list', controller.client.baikeCateList); // 百科一级分类列表接口
  router.post('/client/baike.subcate.list', controller.client.baikeSubcateList); // 百科二级分类列表接口
  router.post('/client/baike.list', controller.client.baikeListBySubcate); // 百科列表接口
  router.post('/client/baike.detail', controller.client.baikeDetail); // 百科详情接口
  router.post('/client/baike.search', controller.client.baikeSearch); // 百科搜索接口

  // 搜索引擎相关
  router.get('/robots.txt', controller.home.robots);
  router.get('/sitemap.xml', controller.sitemap.index);
  router.get('/sitemap/baidusearch.xml', controller.sitemap.searchBD);

  // 其他
  router.get('/privacy', controller.home.privacy);
  router.get('/privacy/luckynum', controller.home.privacyLuckyNum);
  router.get('/privacy/luckynum/en', controller.home.privacyLuckyNum_EN);
  router.get('/privacy/easylife', controller.home.privacyEasylife);
  router.get('/privacy/easylife/en', controller.home.privacyEasylife_EN);
};
