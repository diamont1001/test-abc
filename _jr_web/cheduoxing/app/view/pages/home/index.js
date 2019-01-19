'use strict';

require('./index.less');
require('../../modules/header');
require('../../modules/nav');
require('../../modules/title');
require('../../modules/section-title');
require('../../modules/nav-item-icon');
require('../../modules/list-item-img-text');
require('../../modules/more');
require('../../modules/links');
require('../../modules/copyright');
require('../../modules/about');

$(function() {
  $('.article .btn-get-more a').click(function() {
    if ($(this).attr('disabled')) {
      return;
    }

    const offset = $('.article .list li').length;
    const tag = $('#dataTag').attr('data-tag');

    const url = '/api/getArticleList?type=0&offset=' + offset;

    $.get(url, function(result) {
      if (result) {
        $('.article ul.list').append(result);
      } else {
        $('.article .btn-get-more a')
          .text('到底了 >_<')
          .attr('disabled', true); // eslint-disable-line no-script-url
      }
    });
  });
});