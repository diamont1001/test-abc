'use strict';

const request = require('request');
// const { JSDOM } = require('jsdom');

module.exports = app => {

  class HomeSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    // async getNewsList() {
    //   return new Promise(resolve => {
    //     const hotList = [];

    //     JSDOM.fromURL('https://m.dongqiudi.com/home', {
    //       userAgent: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36",
    //       includeNodeLocations: true,
    //     }).then(dom => {
    //       console.log()
    //       const list = dom.window.document.querySelectorAll('.news-list .news-list-item');
    //       for (let i = 0; i < list.length; i++) {
    //         try {
    //           const item = {
    //             image: list[i].querySelector('.news-list-img-side img').getAttribute('src'),
    //           }
    //           hotList.push(item);
    //         } catch (e) {
    //           console.warn(e);
    //         }
    //       }
    //       resolve(hotList);
    //     }).catch(error => {
    //       console.error(error);
    //       resolve([]);
    //     });
    //   });
    // }

    async getNewsList(count = 8) {
      return new Promise(resolve => {
        request({
          method: 'GET',
          uri: 'https://api.dongqiudi.com/app/tabs/iphone/104.json?mark=gif&version=576&from=msite_com',
          json: true,
          headers: {
            referer: 'm.dongqiudi.com',
          },
          // form: {
          //   offset: 0,
          //   count: 10,
          // }
        }, (error, response, result) => {
          if (!error && response.statusCode === 200 && result && result.contents && result.contents[0] && result.contents[0].articles) {
            const data = [];
            if (result.contents[0].articles.length > 0) {
              for (let i = 0; i < result.contents[0].articles.length; i++) {
                data.push({
                  title: result.contents[0].articles[i].title,
                  description: result.contents[0].articles[i].description,
                  image: result.contents[0].articles[i].thumb,
                  url: 'https://m.dongqiudi.com/article/' + result.contents[0].articles[i].id + '.html',
                });
              }
            }
            if (result.contents[1] && result.contents[1].articles && result.contents[1].articles.length > 0) {
              for (let i = 0; i < result.contents[1].articles.length; i++) {
                data.push({
                  title: result.contents[1].articles[i].title,
                  description: result.contents[1].articles[i].description,
                  image: result.contents[1].articles[i].thumb,
                  url: 'https://m.dongqiudi.com/article/' + result.contents[1].articles[i].id + '.html',
                });
              }
            }
            if (data.length > count) {
              data.length = count;
            }
            resolve(data);
          } else {
            resolve([]);
          }
        });
      });
    }
  }

  return HomeSerivce;
};
