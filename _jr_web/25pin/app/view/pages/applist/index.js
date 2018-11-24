'use strict';

require('./index.less');
require('../../modules/header');
require('../../modules/breadcrumb');
require('../../modules/title');
require('../../modules/banner');
require('../../modules/list-item-app');
require('../../modules/list-item-text');
require('../../modules/more');
require('../../modules/app-declaration');

$(function() {
  $('.app .btn-get-more a').click(function() {
    const $this = $(this);
    if ($this.attr('disabled')) {
      return;
    }

    const $app = $this.closest('.app');
    const $list = $app.find('.list');
    const resourceType = parseInt($app.attr('resourceType')) || 0;
    const offset = $list.find('.jr-m-list-item-app').length;

    $.get('/api/getAppHotList?resourceType=' + resourceType + '&offset=' + offset, function(result) {
      if (result) {
        $list.append(result);
      } else {
        $this.text('到底了 >_<').attr('disabled', true);
      }
    });
  });
});
