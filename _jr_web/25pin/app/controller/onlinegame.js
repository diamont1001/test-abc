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
      title: '贪吃蛇，在线怀旧经典小游戏_瓶子老师学习网',
      description: '贪吃蛇，由瓶子老师学习网提供的在线小游戏，这些属于80后一代人的经典手机小游戏，你敢接受挑战吗？点击有惊喜喔喵。',
      canonical: this.app.config.biz.server + '/onlinegame/snake',
      deviceType: this.ctx.deviceType,
    });
  }
}

module.exports = OnlineGameController;
