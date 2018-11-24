/**
 * 合法域名跳转
 */

'use strict';

module.exports = function() {
  return async function(ctx, next) {
    const host = ctx.host;
    const url = ctx.url;
    const protocol = ctx.protocol + '://';

    if (ctx.app.config.domainList.list.indexOf(host) >= 0) {
      ctx.redirect(protocol + ctx.app.config.domainList.canonical + url);
      ctx.status = 301;
    } else {
      await next();
    }
  };
};
