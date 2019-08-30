/**
 * 服务器接口
 * 
 */

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
}
