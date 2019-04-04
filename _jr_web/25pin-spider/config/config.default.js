'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532953727591_8896';

  // add your config here
  config.middleware = [
  ];

  config.logger = {
    // dir: './logs/25pin-spider',
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  config.spider = {
    ua: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36',
    ua_pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
  };

  config.mysql = {
    client: {
      host: '47.106.209.94',
      port: 3306,
      user: 'root',
      password: '19861001',
      encryptPassword: false,
      database: '25pin',
    },
    app: true,
    agent: false,
  };

  config.cluster = {
    listen: {
      port: 18340,
    },
  };

  return config;
};
