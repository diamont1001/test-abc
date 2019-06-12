'use strict';

require('./index.less');
require('../../modules/header');
// require('../../modules/nav');
require('../../modules/breadcrumb');
require('../../modules/tags');
require('../../modules/section-title');
require('../../modules/list-item-img-text');
require('../../modules/more');

$(function() {
  $('.article .btn-get-more a').click(function() {
    if ($(this).attr('disabled')) {
      return;
    }

    const offset = $('.article .list li').length;
    const tag = $('#dataTag').attr('data-tag');
    const listType = parseInt($('#dataListType').attr('data-type')) || 0;

    let url = '/api/getArticleList?offset=' + offset;

    if (tag) {
      url += '&tag=' + encodeURIComponent(tag);
    }

    if (listType) {
      url += '&listtype=' + listType;
    }

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
