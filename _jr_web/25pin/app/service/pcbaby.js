/**
 * pcbaby百科
 *
 * @{@link https://baike.pcbaby.com.cn/}
 */

'use strict';

const rp = require('request-promise');
const { JSDOM } = require('jsdom');
const MBaike = require('../models/baike');
const MBaikeCate = require('../models/baikeCate');
const MBaikeSubcate = require('../models/baikeSubcate');
const DBBaikeUtils = require('../db/baikeUtils');
const Utils = require('../utils/utils');
const NUM_START_ID = 10000000; // 存储的起始ID值

module.exports = app => {

  class PCBabySerivce extends app.Service {
    constructor(ctx) {
      super(ctx);

      this.dbBaikeUtils = new DBBaikeUtils(app);
    }

    async run(from = 0, to = 10000) {
      this.app.logger.info('fetch pcbaby start.');

      for (let i = from; i <= to; i++) {
        const result = await this.dbBaikeUtils.isExist(NUM_START_ID + i);
        if (!result) {
          try {
            await this.fetchData(i);
          } catch (e) {
            if (e && e.status === 503) {
              // 503 是 pcbaby 防刷的返回码，遇到后，过一会再试
              this.logger.warn('server status 503, retry soon', i);
              await Utils.sleepAsync(1001);
              i--;
            }
          }
        } else {
          this.app.logger.debug('baike exist. id: ', i);
        }
      }

      this.app.logger.info('fetch pcbaby end.');
    }

    async fetchData(id) {
      try {
        const res = await this.app.curl(`https://baike.pcbaby.com.cn/long/${id}.html`, {
          headers: {
            'User-Agent': this.app.config.spider.ua_pc,
          },
          followRedirect: true,
          maxRedirects: 3,
          dataType: 'text',
          timeout: 8000,
        });

        if (res && res.status === 200) {
          const dom = new JSDOM(res.data);

          try {
            const $wrap = dom.window.document.querySelector('.main .l-box');
            const $head = dom.window.document.querySelector('.head .main');

            const $title = $wrap.querySelector('.fl');
            const $content = $wrap.querySelector('.art-text');
            const $cates = $head.querySelectorAll('.h-crumb a');

            const title = ($title ? $title.textContent : '').trim();
            const content = ($content ? $content.innerHTML : '').trim().replace(/<a.*?>/g,'').replace(/<\/a>/g,''); // 过滤掉a标签
            const cate = ($cates && $cates[0] ? $cates[0].textContent : '').trim();
            const subcate = ($cates && $cates[1] ? $cates[1].textContent : '').trim();

            if (cate && subcate && title && content) {
              // 一级分类
              await this.dbBaikeUtils.addCate(new MBaikeCate({name: cate, status: 1}));
              const DCate = await this.dbBaikeUtils.getCateByName(cate);

              // 二级分类
              await this.dbBaikeUtils.addSubcate(new MBaikeSubcate({cate: DCate.id, name: subcate, status: 1}));
              const DSubcate = await this.dbBaikeUtils.getSubcateByName(subcate);

              const baike = new MBaike({
                id: NUM_START_ID + parseInt(id),
                title,
                // keywords: '冷知识,孕育,怀孕,宝宝,准妈妈,准爸爸',
                content: content,
                cate: DCate.id,
                subcate: DSubcate.id,
                source: 'pcbaby',
                status: 1,
                verify_state: 1,
              });

              // this.logger.debug(baike);
              await this.dbBaikeUtils.addBaike(baike);
            } else {
              this.logger.debug('babytree not exist. id: ', id);
            }
          } catch (e) {
            this.app.logger.warn(e);
          }
        } else {
          // this.logger.warn('page access error. id: ' + id + ', status: ' + res.status);
          return Promise.reject(res);
        }
      } catch (e) {
        this.app.logger.warn(e);
      }
      return Promise.resolve();
    }
  }

  return PCBabySerivce;
};
