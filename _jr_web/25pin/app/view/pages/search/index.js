'use strict';

require('./index.less');
require('../../modules/header');
require('../../modules/more');

$(function() {
  $('.search-input-ok').click(function() {
    const key = ($('.search-input-key').val() || '').trim();
    
    location.href = '/search?key=' + encodeURIComponent(key);
  });

  $('.search-input-key').keypress(function(event) {
    if (event && event.keyCode === 13) {
      $('.search-input-ok').click();
    }
  });

  $('.list-wall').on('click', '.more', function() {
    const $this = $(this);
    const offset = $('.list-wall .list-ul li').length;
    const key = ($this.attr('data-key') || '').trim();

    let url = '/api/getSearch?offset=' + offset + '&key=' + encodeURIComponent(key);

    $this.hide();

    $.get(url, function(result) {
      if (result) {
        $('.list-wall .list-ul').append(result);
        $this.show();
      } else {
        $('.list-wall').append('<div class="empty-placeholder">-- 到底了 --</div>');
      }
    });
  });
});
