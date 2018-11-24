'use strict';

require('./index.less');
require('../../modules/header');
require('../../modules/breadcrumb');
require('../../modules/title');
require('../../modules/list-item-app');
require('../../modules/more');
require('../../modules/app-declaration');

$(function() {
  $('.btn-get-more a').click(function() {
    const $this = $(this);
    if ($this.attr('disabled')) {
      return;
    }

    const $handle = $this.closest('.developer');
    const $list = $handle.find('.list');
    const developer = $handle.attr('developer');
    const offset = $list.find('.jr-m-list-item-app').length;

    $.get('/api/getAppListByDeveloper?id=' + developer + '&offset=' + offset, function(result) {
      if (result) {
        $list.append(result);
      } else {
        $this.text('到底了 >_<').attr('disabled', true);
      }
    });
  });
});
