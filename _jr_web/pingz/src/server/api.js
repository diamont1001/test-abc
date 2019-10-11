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
   * 添加文章收藏
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

        // 去重
        const hash = {};
        const listFormat = favList.filter((item) => {
          if (hash[item.url]) {
            return false;
          }
          hash[item.url] = true;
          return true;
        });

        await AsyncStorage.setItem('_pingz_fav_', JSON.stringify(listFormat));
      } else {
        await AsyncStorage.setItem('_pingz_fav_', JSON.stringify([{url, title}]));
      }
    } catch (e) {
      // console.warn(e);
      await AsyncStorage.setItem('_pingz_fav_', JSON.stringify([{url, title}]));
    }
    return Promise.resolve();
  }

  // 文章收藏列表
  static async favList() {
    try {
      const data = await AsyncStorage.getItem('_pingz_fav_');
      const list = JSON.parse(data);

      if (typeof list === 'object' && list.length > 0) {
        return Promise.resolve(list);
      }
      return Promise.resolve([]);
    } catch (err) {
      console.warn(err);
      return Promise.resolve([]);
    }
  }

  /**
   * 取消文章收藏
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

  /**
   * 百科二级分类列表查询
   * @return {Promise} -
   */
  static async baikeSubcateList(cate = 0) {
    return ServerProtocol.protocol({
      api: '/client/baike.subcate.list',
      data: {
        cate,
      }
    });
  }

  // 通过二级分类来筛选百科列表
  static async getBaikeListBySubcate(params = {}) {
    const {
      offset,
      limit,
      subcate,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/baike.list',
      data: {
        offset: offset || 0,
        limit: limit || 10,
        subcate: subcate || 0,
      },
    });
  }

  /**
   * 百科详情
   * @param  {Object} params {id}
   * @return {Promise} -
   */
  static async baikeDetail(params = {}) {
    const {
      id,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/baike.detail',
      data: {
        id: id || 0,
      },
    });
  }

  /**
   * 百科搜索
   * @param  {Object} params {offset, key}
   * @return {Promise} -
   */
  static async baikeSearch(params = {}) {
    const {
      offset,
      key,
    } = params;

    return ServerProtocol.protocol({
      api: '/client/baike.search',
      data: {
        offset: offset || 0,
        key: key || '',
      },
    });
  }

  // 百科收藏列表
  static async baikeFavList() {
    try {
      const data = await AsyncStorage.getItem('_pingz_baike_fav_');
      const list = JSON.parse(data);

      if (typeof list === 'object' && list.length > 0) {
        return Promise.resolve(list);
      }
      return Promise.resolve([]);
    } catch (err) {
      console.warn(err);
      return Promise.resolve([]);
    }
  }

  /**
   * 添加收藏
   * @param  {Object} params {id, title}
   * @return {Promise} -
   */
  static async baikeFavAdd(params = {}) {
    const id = params.id || params.uri;
    const title = params.title || params.name;

    try {
      const favList = JSON.parse(await AsyncStorage.getItem('_pingz_baike_fav_'));

      if (typeof favList === 'object' && favList.length > 0) {
        favList.unshift({
          id,
          title,
        });

        // 去重
        const hash = {};
        const listFormat = favList.filter((item) => {
          if (hash[item.id]) {
            return false;
          }
          hash[item.id] = true;
          return true;
        });

        await AsyncStorage.setItem('_pingz_baike_fav_', JSON.stringify(listFormat));
      } else {
        await AsyncStorage.setItem('_pingz_baike_fav_', JSON.stringify([{id, title}]));
      }
    } catch (e) {
      // console.warn(e);
      await AsyncStorage.setItem('_pingz_baike_fav_', JSON.stringify([{id, title}]));
    }
    return Promise.resolve();
  }

  /**
   * 取消收藏
   * @param  {Object} params {id}
   * @return {Promise} -
   */
  static async baikeFavDelete(params = {}) {
    const id = params.id || params.uri;

    if (!id) {
      return Promise.resolve();
    }

    try {
      const favList = JSON.parse(await AsyncStorage.getItem('_pingz_baike_fav_'));

      if (typeof favList === 'object' && favList.length > 0) {
        for (let i = 0; i < favList.length; i++) {
          if (favList[i] && favList[i].id === id) {
            favList.splice(i, 1);
            break;
          }
        }
      }
      await AsyncStorage.setItem('_pingz_baike_fav_', JSON.stringify(favList));
    } catch (e) {
      // console.warn(e);
    }
    return Promise.resolve();
  }

  /**
   * 清空收藏
   * @return {Promise} -
   */
  static async baikeFavClear() {
    try {
      await AsyncStorage.removeItem('_pingz_baike_fav_');
    } catch (e) {
      // console.warn(e);
    }
    return Promise.resolve();
  }
}
