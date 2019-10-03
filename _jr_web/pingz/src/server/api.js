/**
 * 服务器接口
 * 
 */

import AsyncStorage from '@react-native-community/async-storage';
import ServerProtocol from './protocol';

var md5 = require('md5');

export default class ServerApi {
  /**
   * 查询文章列表
   * @param  {Object} params {listType, offset, limit, tagId}
   * @return {Promise} -
   */
  static async getArticleList(params = {}) {
    const {
      listType,
      offset,
      limit,
      tagId,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/article.list',
      data: {
        listType: listType || 0,
        offset: offset || 0,
        limit: limit || 10,
        tagId: tagId || 0,
      },
    });
  }

  /**
   * 文章详情
   * @param  {Object} params {id}
   * @return {Promise} -
   */
  static async articleDetail(params = {}) {
    const {
      id,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/article.detail',
      data: {
        id: id || 0,
      },
    });
  }

  /**
   * 文章搜索
   * @param  {Object} params {offset, key}
   * @return {Promise} -
   */
  static async articleSearch(params = {}) {
    const {
      offset,
      key,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/article.search',
      data: {
        offset: offset || 0,
        key: key || '',
      },
    });
  }

  /**
   * 文章标签列表查询
   * @return {Promise} -
   */
  static async articleTagList() {
    return ServerProtocol.protocol({
      api: '/client/article.tag.list',
    });
  }

  /**
   * 添加收藏
   * @param  {Object} params {url, title}
   * @return {Promise} -
   */
  static async favAdd(params = {}) {
    const url = params.url || params.uri;
    const title = params.title || params.name;

    try {
      const favList = JSON.parse(await AsyncStorage.getItem('_pingz_fav_'));

      if (typeof favList === 'object' && favList.length > 0) {
        favList.unshift({
          url,
          title,
        });
        await AsyncStorage.setItem('_pingz_fav_', JSON.stringify(favList));
      } else {
        await AsyncStorage.setItem('_pingz_fav_', JSON.stringify([{url, title}]));
      }
    } catch (e) {
      // console.warn(e);
      await AsyncStorage.setItem('_pingz_fav_', JSON.stringify([{url, title}]));
    }
    return Promise.resolve();
  }

  /**
   * 取消收藏
   * @param  {Object} params {url}
   * @return {Promise} -
   */
  static async favDelete(params = {}) {
    const url = params.url || params.uri;

    if (!url) {
      return Promise.resolve();
    }

    try {
      const favList = JSON.parse(await AsyncStorage.getItem('_pingz_fav_'));

      if (typeof favList === 'object' && favList.length > 0) {
        for (let i = 0; i < favList.length; i++) {
          if (favList[i] && favList[i].url === url) {
            favList.splice(i, 1);
            break;
          }
        }
      }
      await AsyncStorage.setItem('_pingz_fav_', JSON.stringify(favList));
    } catch (e) {
      // console.warn(e);
    }
    return Promise.resolve();
  }

  /**
   * 清空收藏
   * @return {Promise} -
   */
  static async favClear() {
    try {
      await AsyncStorage.removeItem('_pingz_fav_');
    } catch (e) {
      // console.warn(e);
    }
    return Promise.resolve();
  }


  /**
   * 百科一级分类列表查询
   * @return {Promise} -
   */
  static async baikeCateList() {
    return ServerProtocol.protocol({
      api: '/client/baike.cate.list',
    });
  }
}
