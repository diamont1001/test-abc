/**
 * 日志清理
 *
 */

'use strict';

const fs = require('fs');
const del = require('del');

module.exports = app => {

  class LogSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    async clean() {
      this.app.logger.info('log clean start.');

      let logPath = this.app.config.logger.dir;
      const year = this.app.config.currentYear || (new Date().getYear() + 1900);

      if (logPath.lastIndexOf('/') + 1 !== logPath.length) {
        logPath += '/';
      }

      if (fs.existsSync(logPath)) {
        this.app.logger.info('cleaning... ', logPath);
        del.sync(logPath + '*.log.' + year + '-*');
      } else {
        this.app.logger.warn('log path is not exist. ', logPath);
      }

      this.app.logger.info('log clean end.');
    }
  }

  return LogSerivce;
};
