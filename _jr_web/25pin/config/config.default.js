'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532953727591_8896';

  // add your config here
  config.middleware = [
    'url',
    'userAgent',
  ];

  config.logger = {
    dir: './logs/25pin-com',
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  config.ejs = {
    cache: false,
    debug: false,
    compileDebug: true,
    delimiter: null,
    // strict: false,
  };

  // 跳转到 www.25pin.com 的域名
  config.domainList = {
    list: [
      '25pin.com',
      '25ping.com',
      'www.25ping.com',
      // '100.84.228.200:7001',
    ],
    canonical: 'www.25pin.com', // 站点惟一域名
  };

  config.security = {
    xframe: {
      // enable: false,
      value: 'ALLOW-FROM http://tongji.baidu.com',
    },
  };

  config.spider = {
    ua: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36',
    ua_pc: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
  };

  config.biz = {
    title: '爱玩品资源站_游戏软件APP免费下载|美女写真|有趣冷知识',
    keywords: '游戏,手游,软件,APP,尤果网,美女写真,美女图片,冷知识,有趣冷知识,爱玩品,爱玩品资源站,25pin',
    description: '爱玩品资源站（www.25pin.com），为你推荐丰富好玩的资源，让优质资源脱颖而出。游戏软件APP、美女写真集图片、超级有趣的冷知识、生活小常识等热门资源推荐。',
    server: 'http://www.25pin.com',
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

  // layout 版本号，每次发版前需要把它修改一下
  config.layoutVersion = '2018120701';
  config.currentYear = new Date().getYear() + 1900;

  return config;
};
