/**
 * 日志清理
 *
 */

'use strict';

module.exports = app => {

  class LogSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    async clean() {
      this.app.logger.info('log clean start.');

      this.app.logger.info('log clean end.');
    }
  }

  return LogSerivce;
};
