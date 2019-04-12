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
    title: '有趣冷知识_生活小常识_瓶子老师学习网',
    keywords: '冷知识,生活小常识,文化,历史,地理,英语,科学,母婴,瓶子老师,学习网,25pin',
    description: '瓶子老师学习网（www.25pin.com），爱生活爱学习，跟着瓶子老师一起学习有趣的冷知识、生活小常识、文化、历史、地理、英语、科学,母婴等热门小知识。',
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
  config.layoutVersion = '2019041201';
  config.currentYear = new Date().getYear() + 1900;

  return config;
};
