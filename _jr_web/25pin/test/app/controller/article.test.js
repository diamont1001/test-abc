'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/article.test.js', () => {
  it('200 GET /article', () => {
    return app.httpRequest()
      .get('/article')
      // .expect('hi, egg')
      .expect(200);
  });

  it('200 GET /article/1', () => {
    return app.httpRequest()
      .get('/article/1')
      .expect(200);
  });

  it('404 GET /article/1 1', () => {
    return app.httpRequest()
      .get('/article/1 1')
      .expect(404);
  });

  it('404 GET /article/1pp', () => {
    return app.httpRequest()
      .get('/article/1pp')
      .expect(404);
  });

  it('404 GET /article/pp', () => {
    return app.httpRequest()
      .get('/article/pp')
      .expect(404);
  });
});
