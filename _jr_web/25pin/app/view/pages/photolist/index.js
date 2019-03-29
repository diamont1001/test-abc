'use strict';

require('./index.less');
require('../../modules/header');
// require('../../modules/nav');
require('../../modules/tags');
require('../../modules/image-2');
require('../../modules/more');

$(function() {
  $('.photo .btn-get-more a').click(function() {
    if ($(this).attr('disabled')) {
      return;
    }

    const offset = $('.photo .list .jr-m-image-2').length || 0;
    const tag = parseInt($('.tag-list .tag-item.current a').attr('data-tag')) || 0;

    $.get('/api/getPhontList?tag=' + tag + '&offset=' + offset, function(result) {
      if (result) {
        $('.photo .list').append(result);
      } else {
        $('.photo .btn-get-more a')
          .text('到底了 >_<')
          .attr('disabled', true); // eslint-disable-line no-script-url
      }
    });
  });
});
