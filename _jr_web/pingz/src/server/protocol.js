/**
 * 服务器接口协议
 * 
 */

import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {IDFA} from 'react-native-idfa';
import ERROR_CODE from './code';
import ERROR_MESSAGE from './errorMessage';

const md5 = require('md5');
const gmCrypto = require('../helper/gmCrypto');

// const _host = 'http://127.0.0.1:7001';
const _host = 'http://www.25pin.com';

export default class ServerProtocol {

  static _store = null;

  static setStore(store) {
    this._store = store;
  }

  // 设备信息
  static async getUdi() {
    const udi = {};

    try {
      udi.version = await DeviceInfo.getReadableVersion();
      udi.os = await Platform.OS;
      udi.uniqueID = await DeviceInfo.getUniqueId();
      udi.brand = await DeviceInfo.getBrand();
      udi.model = await DeviceInfo.getModel();
      udi.systemName = await DeviceInfo.getSystemName();
      udi.systemVersion = await DeviceInfo.getSystemVersion();
      udi.isEmulator = await DeviceInfo.isEmulator();
    } catch (err) {
      console.warn(err);
    }

    // 广告标识 IDFA
    try {
      const idfa = await IDFA.getIDFA();
      if (idfa) {
        // console.log('get idfa ok. ', idfa);
        udi.idfa = idfa;
      }
    } catch (err) {
      console.warn(err);
    }

    return new Promise(resolve => {
      resolve(gmCrypto.xorEncode(JSON.stringify(udi)));
    });
  }

  // 保证getUdi()只运行一次
  static _udiPrimise = this.getUdi();

  /**
   * 服务端接口协议
   * @param  {Object} params {api, header, data}
   * @return {Promise} -
   */
  static async protocol(params) {
    if (!params || !params.api) {
      console.warn('Params Required.');
      return Promise.reject({
        code: ERROR_CODE.PARAMS_ERROR,
        message: 'Params Required.',
      });
    }

    const _userToken = this._store ? this._store.getState().loginReducer.userToken : '';

    const {
      api, // 请求的接口，比如 /client/blog.post
      data, // 请求数据包体，根据 'Content-Type' 不同，传不同类型的数据，比如 formData
      isForm, // 是否为表单类型，文件以 files 为字段
      header, // 自定义 Header 信息
    } = params;

    const url = _host + (api.indexOf('/') === 0 ? api : '/' + api);

    // http header
    const udi = await this._udiPrimise;
    const headers = Object.assign({
      'Content-Type': isForm ? 'multipart/form-data;charset=utf-8' : 'application/json',
      'x-caller': 'client',
      'x-token': _userToken,
      'x-udi': udi,
    }, header);


    // 过滤没用的参数
    let body = Object.assign({timestamp: Date.now()}, data);
    for (let i in body) {
      if (body.hasOwnProperty(i) && (body[i] === null || body[i] === undefined || body[i] === '')) {
        delete body[i];
      }
    }


    // 签名
    const secret = 'pingz@25pin.com';
    const dataKeys = Object.keys(body).sort();
    const dataArray = [];
    for (const key of dataKeys) {
      // 如果是上传文件字段则跳过不参与加密
      if (isForm && key === 'files') {
        continue;
      }
      dataArray.push(`${key}=${body[key]}`);
    }
    const sign = md5(dataArray.join('') + secret);
    headers['x-sign'] = sign;


    // 格式化请求数据包
    if (isForm) {
      const formData = new FormData();

      for (const key of Object.keys(body)) {
        if (key === 'files') {
          if (body[key] && body[key].length > 0) {
            const files = body[key];

            for (let i = 0; i < files.length; i++) {
              if (files[i] && files[i].uri) {
                formData.append('file', {
                  uri: files[i].uri,
                  type: 'application/octet-stream',
                  name: 'image.jpg',
                });
              }
            }
          }
        } else {
          formData.append(key, body[key]);
        }
      }

      // console.log(formData);

      body = formData;
    } else {
      body = JSON.stringify(body);
    }

    // fetch 请求
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    try {
      if (!result || result.status !== 200) {
        console.warn(result);
        return Promise.reject({
          code: -1,
          message: ERROR_MESSAGE[result.status + ''] || ERROR_MESSAGE['default'],
        });
      }

      const response = await result.json();

      if (response && response.code === 0) {
        console.log(`${api} ok.`, response);
        return Promise.resolve(response);
      } else {
        console.warn(`${api} error.`, response);
        return Promise.reject(response);
      }
    } catch (err) {
      console.warn(`${api} error.`, err);
      return Promise.reject({
        code: -2,
        message: ERROR_MESSAGE['default'],
      });
    }
  }

}
