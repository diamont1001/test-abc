'use strict';

require('./index.less');
require('../../modules/header');
require('../../modules/breadcrumb');
require('../../modules/list-item-text');
require('../../modules/more');

$(function() {
  $('.btn-get-more a').click(function() {
    const $this = $(this);
    if ($this.attr('disabled')) {
      return;
    }

    const $handle = $this.closest('.developer');
    const $list = $handle.find('.list');
    const offset = $list.find('.list-item-text').length;

    $.get('/api/getDeveloperList?offset=' + offset, function(result) {
      if (result) {
        $list.append(result);
      } else {
        $this.text('到底了 >_<').attr('disabled', true);
      }
    });
  });
});
