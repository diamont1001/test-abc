'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/photo.test.js', () => {
  it('200 GET /photo', () => {
    return app.httpRequest()
      .get('/photo')
      // .expect('hi, egg')
      .expect(200);
  });

  it('200 GET /photo/1', () => {
    return app.httpRequest()
      .get('/photo/1')
      .expect(200);
  });

  it('404 GET /photo/1 1', () => {
    return app.httpRequest()
      .get('/photo/1 1')
      .expect(404);
  });

  it('404 GET /photo/1pp', () => {
    return app.httpRequest()
      .get('/photo/1pp')
      .expect(404);
  });

  it('404 GET /photo/pp', () => {
    return app.httpRequest()
      .get('/photo/pp')
      .expect(404);
  });

  it('200 GET /photo/t_19', () => {
    return app.httpRequest()
      .get('/photo/t_19')
      .expect(200);
  });

  it('404 GET /photo/t_', () => {
    return app.httpRequest()
      .get('/photo/t_')
      .expect(404);
  });

  it('404 GET /photo/t_19 0', () => {
    return app.httpRequest()
      .get('/photo/t_19 0')
      .expect(404);
  });

  it('404 GET /photo/t_19p', () => {
    return app.httpRequest()
      .get('/photo/t_19p')
      .expect(404);
  });

  it('404 GET /photo/t_ 19', () => {
    return app.httpRequest()
      .get('/photo/t_ 19')
      .expect(404);
  });
});
