/**
 * 在线小游戏
 */


'use strict';

const Controller = require('egg').Controller;

class OnlineGameController extends Controller {
  // 贪吃蛇
  async snake() {
    await this.ctx.layoutRender('pages/onlinegame/snake/index.ejs', {
      name: 'snake',
      title: '贪吃蛇，在线怀旧经典小游戏',
      keywords: '贪吃蛇,snake,在线游戏,爱玩品',
      description: '贪吃蛇，由爱玩品手机资源站提供的在线小游戏，这些属于80后一代人的经典手机小游戏，你敢接受挑战吗？点击有惊喜喔喵。爱玩品手机资源站，为你推荐丰富好玩的资源，让优质资源脱颖而出',
      canonical: this.app.config.biz.server + '/onlinegame/snake',
    });
  }
}

module.exports = OnlineGameController;
