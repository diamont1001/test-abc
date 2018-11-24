'use strict';

module.exports = function() {
  return async function(ctx, next) {
    const userAgent = ctx.get('user-agent') || '';
    const lowerUserAgent = userAgent.toLocaleLowerCase();

    // console.log(userAgent);

    if (lowerUserAgent.indexOf('mobile') > -1 || lowerUserAgent.indexOf('android') > -1) {
      ctx.deviceType = 'Mobile';
    } else {
      ctx.deviceType = 'PC';
    }

    await next();
  };
};
