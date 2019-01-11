'use strict';

const { assert } = require('egg-mock/bootstrap');
const Xor = require('../../../app/libs/xor');

describe('xor encode and decode', () => {

  it('english', function* () {
    const str = 'hello xor.';
    assert(Xor.decode(Xor.encode(str)) === str);
  });

  it('number', function* () {
    const str = '123123123129';
    assert(Xor.decode(Xor.encode(str)) === str);
  });

  it('中文', function* () {
    const str = '深圳市腾讯计算机系统有限公司';
    assert(Xor.decode(Xor.encode(str)) === str);
  });

  it('all', function* () {
    const str = '深圳市腾讯计算机系统有限公司 123 你好啊 *dfkjdksf8  d8 f8dsf s';
    assert(Xor.decode(Xor.encode(str)) === str);
  });
});
