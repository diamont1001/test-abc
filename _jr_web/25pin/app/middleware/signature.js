/**
 * 客户端接口签名校验
 */

'use strict';

module.exports = function() {
  return async function(ctx, next) {
    const path = ctx.request.path;

    if (path.startsWith('/client/')) {
      if (!ctx.checkSign()) {
         return;
      }
    }

    await next();
  };
};
