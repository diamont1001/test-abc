/**
 * 日志清理
 *
 */

'use strict';

const Path = require('path');
const fs = require('fs');
const del = require('del');

module.exports = app => {

  class LogSerivce extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    async clean() {
      this.app.logger.info('log clean start.');

      const logPath = Path.join(process.env.PWD, this.app.config.logger.dir);
      const year = this.app.config.currentYear || (new Date().getYear() + 1900);

      this.app.logger.info('cleaning... ', logPath);

      if (fs.existsSync(logPath)) {
        del.sync(logPath + '*.log.' + year + '-*');
      }

      this.app.logger.info('log clean end.');
    }
  }

  return LogSerivce;
};
