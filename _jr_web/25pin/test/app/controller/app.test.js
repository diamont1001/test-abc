'use strict';

const { app } = require('egg-mock/bootstrap');

describe('test/app/controller/app.test.js', () => {
  it('200 GET /app', () => {
    return app.httpRequest()
      .get('/app')
      // .expect('hi, egg')
      .expect(200);
  });

  it('200 GET /app/com.tencent.tmgp.sgame', () => {
    return app.httpRequest()
      .get('/app/com.tencent.tmgp.sgame')
      .expect(200);
  });

  it('404 for ,', () => {
    return app.httpRequest()
      .get('/app/com,tencent.tmgp.sgame')
      .expect(404);
  });

  it('404 for blank', () => {
    return app.httpRequest()
      .get('/app/com.tencent. tmgp.sgame')
      .expect(404);
  });

  it('sql', () => {
    return app.httpRequest()
      .get('/app/(com.tencent.tmgp.sgame')
      .expect(404);
  });

  it('sql', () => {
    return app.httpRequest()
      .get('/app/com.tencent.tmgp.sgame)')
      .expect(404);
  });

  it('xss', () => {
    return app.httpRequest()
      .get('/app/<script>alert("xss");</script>')
      .expect(404);
  });
});
