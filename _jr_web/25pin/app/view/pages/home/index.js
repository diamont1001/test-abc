'use strict';

require('./index.less');
require('../../modules/header');
// require('../../modules/nav');
// require('../../modules/iconsite');
// require('../../modules/textsite');
require('../../modules/more');
require('../../modules/section-title');
require('../../modules/nav-img-text-n');
require('../../modules/app-rec-4');
require('../../modules/nav-imgs-3');
require('../../modules/list-item-text');
require('../../modules/list-item-img-text');
require('../../modules/banner');
require('../../modules/links');
require('../../modules/app-declaration');
require('../../modules/copyright');
require('../../modules/about');

$(function() {
  $('.article .btn-get-more a').click(function() {
    if ($(this).attr('disabled')) {
      return;
    }

    const offset = $('.article .list .list-item-img-text').length || 0;

    $.get('/api/getArticleList?offset=' + offset, function(result) {
      if (result) {
        $('.article .list').append(result);
      } else {
        $('.article .btn-get-more a')
          .text('到底了 >_<')
          .attr('disabled', true); // eslint-disable-line no-script-url
      }
    });
  });
});