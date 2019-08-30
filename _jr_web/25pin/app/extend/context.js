'use strict';

const MD5 = require('md5');
const crypto = require('../utils/crypto');

module.exports = {
  async layoutRender(tpl, locals) {
    const data = Object.assign({
      layoutVersion: this.app.config.layoutVersion,
    }, locals);

    return this.render(tpl, data, {
      layout: 'layout.ejs',
      rmWhitespace: true,
    });
  },

  /**
   * 格式化列表接口输出
   * @param {Object} result - 列表结果
   */
  formatListOutput(result) {
    result = result || {};

    if (Array.isArray(result)) {
      this.body = {
        code: 0,
        message: '',
        data: {
          content: result,
        },
      };
    } else {
      this.body = {
        code: 0,
        message: '',
        data: {
          total: result.count || 0,
          content: result.rows || [],
        },
      };
    }
  },

  /**
   * 格式化操作结果输出
   * @param {Object} result - 操作结果
   */
  formatActionOutput(result) {
    this.body = {
      code: 0,
      message: '',
      data: result,
    };
  },

  /**
   * 格式化错误结果输出
   * @param {number} errorCode - 错误码
   * @param {string} message - 返回提示信息
   */
  formatErrorOutput(errorCode, message) {
    this.body = {
      code: errorCode,
      message,
      data: {},
    };
  },

  /**
   * 从头部获取用户设备信息【作废】
   * @return {object} 用户设备信息
   */
  async getUserDeviceInfo() {
    const udi = this.get('x-udi');
    let deviceInfo = null;

    if (udi) {
      try {
        const udiJson = crypto.xorDecode(udi);

        deviceInfo = udiJson && JSON.parse(udiJson) || null;
      } catch (error) {
        this.logger.error('【解析设备信息异常】', udi, error);
      }
      if (deviceInfo && deviceInfo.isEmulator) {
        this.logger.info('【模拟器设备】', deviceInfo);
      }
    }
    this.logger.debug('【用户设备信息】', deviceInfo);

    return deviceInfo;
  },

  /**
   * 校验接口签名
   * @param {object} data 参数体，不传则从 request.body 中获取
   * @return {boolean} 是否校验通过
   */
  checkSign(data) {
    const caller = this.get('x-caller');
    const sign = this.get('x-sign');

    if (!caller || !sign) {
      this.logger.error('【非法签名】missing caller or sign.', caller, sign, data);
      this.status = 403;
      this.body = 'Invalid Request';
      return false;
    }

    const signSecret = this.app.config.signSecret;

    if (!signSecret) {
      this.logger.error('【非法签名】caller sign error.', caller, data);
      this.status = 403;
      this.body = 'Invalid Request';
      return false;
    }

    data = data || this.request.body;

    const dataKeys = Object.keys(data).sort();
    const dataArray = [];
    for (const key of dataKeys) {
      // 文件类型跳过
      if (key === 'file') {
        continue;
      }
      dataArray.push(`${key}=${data[key]}`);
    }

    if (!dataArray.length) {
      this.logger.error('【非法签名】no data.', sign, data);
      this.status = 403;
      this.body = 'Invalid Request';
      return false;
    }

    const _sign = MD5(dataArray.join('') + signSecret);

    if (sign.toLowerCase() === _sign.toLowerCase()) {
      this.CALLER = caller;
      return true;
    } else {
      this.logger.error('【非法签名】sign error', sign, data);
      this.status = 403;
      this.body = 'Invalid Request';
      return false;
    }
  },
};
