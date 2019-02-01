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
    dir: './logs/cheduoxing',
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

  // 跳转到 www.cheduoxing.com 的域名
  config.domainList = {
    list: [
      // '100.84.228.200:7001',
    ],
    canonical: 'www.cheduoxing.com', // 站点惟一域名
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
    title: '车多星汽车网_专业的用车养车经验分享平台_老司机带你飞',
    keywords: '汽车,用车,养车,买车,提车,开车,汽车保养,汽车品牌,新车评测,老司机,车主资讯,事故处理,汽车改装',
    description: '新手上路，老司机带飞。用车养车过程有问题？问车多星！车多星汽车网，专业的用车养车经验分享平台，为您解答用车过程中常遇到的疑难杂症。在这里，菜鸟也可以秒变老司机。',
    server: 'http://www.cheduoxing.com',
  };

  config.mysql = {
    client: {
      host: '47.106.209.94',
      port: 3306,
      user: 'root',
      password: '19861001',
      encryptPassword: false,
      database: 'cheduoxing',
    },
    app: true,
    agent: false,
  };

  // layout 版本号，每次发版前需要把它修改一下
  config.layoutVersion = '2019020101';
  config.currentYear = new Date().getYear() + 1900;

  return config;
};
