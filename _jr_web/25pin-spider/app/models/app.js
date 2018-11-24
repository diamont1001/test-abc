/**
 * 数据模型：应用APP
 */

'use strict';

class MApp {

  constructor(obj = {}) {
    this.packageName = obj.packageName; // 包名
    this.name = obj.name; // 应用名称
    this.resourceType = parseInt(obj.resourceType) || 0; // 应用类型（0：软件，1：游戏）
    this.size = parseInt(obj.size) * 1024 || 0; // 包大小
    this.icon = obj.iconUrl;
    this.editorRecommend = obj.editorRecommend; // 小编推荐语
    this.appDesc = obj.appDesc; // 描述
    this.verDesc = obj.verDesc; // 更新说明
    this.downloads = parseInt(obj.downloads) || 0; // 下载次数
    this.downloadUrl = obj.downloadUrl; // 下载地址
    this.video = obj.video; // 视频地址
    this.versionName = obj.versionName; // 版本名称
    this.minSdkVersion = obj.minSdkVersion;
    this.updateTime = parseInt(obj.updateTime) || 0;
    this.developer = obj.seller; // 开发者
    this.count = parseInt(obj.count) || 0;
    this.status = parseInt(obj.status) || 0;

    // 屏幕截图
    try {
      this.images = obj.images.split('\n').map(item => {
        return item;
      });
    } catch (e) {
      this.images = [];
    }
  }

  static get TABLE() {
    return 'tb_app';
  }

  active() {
    this.status = 1;
  }

  to() {
    return {
      packageName: this.packageName,
      name: this.name,
      resourceType: this.resourceType,
      size: this.size,
      icon: this.icon,
      editorRecommend: this.editorRecommend,
      appDesc: this.appDesc,
      verDesc: this.verDesc,
      downloads: this.downloads,
      downloadUrl: this.downloadUrl,
      video: this.video,
      versionName: this.versionName,
      minSdkVersion: this.minSdkVersion,
      updateTime: this.updateTime,
      developer: this.developer,
      count: this.count,
      status: this.status,
      images: this.images.length > 0 ? this.images.join('\n') : '',
    };
  }
}

module.exports = MApp;
