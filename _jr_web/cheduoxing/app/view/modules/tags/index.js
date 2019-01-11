'use strict';

require('./index.less');

$(function() {
  $('#btnSwitch').click(function() {
    $('.tag-list').toggleClass('on');
  });
});
