/**
 * 汽车品牌
 */

'use strict';

const Controller = require('egg').Controller;
const Xor = require('../libs/xor');

class BrandController extends Controller {
  async index() {
    const brandId = parseInt(this.ctx.params.id) || 0;

    if (!brandId || brandId + '' !== this.ctx.params.id) { // 防止这种情况：'/brand/2p' 或者 '/brand/ 2'
      this.ctx.status = 404;
      return;
    }

    const [ brand, preBrand, nextBrand ] = await Promise.all([
      this.service.brand.getDetail(brandId),
      this.service.brand.getPreDetail(brandId),
      this.service.brand.getNextDetail(brandId),
    ]);

    // this.app.logger.debug(brand);

    if (!brand || brand.status !== 1) {
      this.ctx.status = 404;
      return;
    }

    // 访问一次，记录一下数据库
    this.service.brand.accessOnce(brandId);

    const canonical = this.app.config.biz.server + '/brand/' + brand.id;

    await this.ctx.layoutRender('pages/brand/index.ejs', {
      name: 'brand',
      title: `${brand.name}品牌简介|车标|品牌定位`,
      description: '',
      canonical: this.app.config.biz.server + '/brand/' + brand.id,
      breadcrumb: [{ url: '/brand', name: '汽车品牌' }],
      brand,
      preBrand,
      nextBrand,
    });
  }

  async list() {
    const brandList = await this.service.brand.getAvailableList(0, 1000);

    if (!brandList || brandList.length <= 0) {
      this.logger.error('brand list empty. 404');
      this.ctx.status = 404;
      return;
    }

    await this.ctx.layoutRender('pages/brandlist/index.ejs', {
      name: 'brandlist',
      title: '汽车品牌大全',
      description: '',
      canonical: this.app.config.biz.server + '/brand',
      brandList,
      abcList: this.ctx.deviceType === 'Mobile' && ['A','B','C','D','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z'],
    });
  }
}

module.exports = BrandController;
