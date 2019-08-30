'use strict';

module.exports = function() {
  return async function(ctx, next) {
    const userAgent = ctx.get('user-agent') || '';
    const lowerUserAgent = userAgent.toLocaleLowerCase();

    // console.log(userAgent);

    if (lowerUserAgent.indexOf('pingz/') > 0) {
      ctx.deviceType = 'Client';
    } else if (lowerUserAgent.indexOf('mobile') > -1 || lowerUserAgent.indexOf('android') > -1) {
      ctx.deviceType = 'Mobile';
    } else {
      ctx.deviceType = 'PC';
    }

    if (lowerUserAgent.indexOf('android') > -1) {
      ctx.osType = 'android';
    } else if (lowerUserAgent.indexOf('iphone') > -1 || lowerUserAgent.indexOf('ipad') > -1 || lowerUserAgent.indexOf('ipod') > -1) {
      ctx.osType = 'ios';
    } else {
      ctx.osType = 'others';
    }

    await next();
  };
};
