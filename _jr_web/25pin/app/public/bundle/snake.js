!function(t){var o={};function n(e){if(o[e])return o[e].exports;var i=o[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=o,n.d=function(t,o,e){n.o(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:e})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,o){if(1&o&&(t=n(t)),8&o)return t;if(4&o&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(n.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&o&&"string"!=typeof t)for(var i in t)n.d(e,i,function(o){return t[o]}.bind(null,i));return e},n.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(o,"a",o),o},n.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},n.p="",n(n.s=94)}({0:function(t,o,n){"use strict";n(1),$("#headerBtnMenu").click(function(){$("#headerMenu").show()})},1:function(t,o,n){},39:function(t,o,n){"use strict";var e={X:2,Y:2,ROW:20,COL:20,borderColor:"#2BB2BC",bgColor:"white",bodyColor:"#00FFFF",foodColor:"#EE5555",gameInterval:80,initSnakeLength:6};e.init=function(t){!function t(o,n){var e=0,i=0;n=isNaN(parseInt(n))?10:parseInt(n);window.innerWidth?i=window.innerWidth:document.body&&document.body.clientWidth&&(i=document.body.clientWidth);window.innerHeight?e=window.innerHeight:document.body&&document.body.clientHeight&&(e=document.body.clientHeight);document.documentElement&&document.documentElement.clientHeight&&document.documentElement.clientWidth&&(e=document.documentElement.clientHeight,i=document.documentElement.clientWidth);n-- >0&&(e<=0||i<=0)?setTimeout(function(){t(o,n)},200):o({height:e,width:i})}(function(o){var n=Math.min(o.width,o.height-200,428)-48;e.bodyW=Math.floor(n/e.COL),e.bodyH=Math.floor(n/e.ROW),e.backgroundW=e.bodyW*e.COL,e.backgroundH=e.bodyH*e.ROW,t()})},t.exports=e},94:function(t,o,n){"use strict";n(95),n(0);var e=n(39),i=n(97);function r(t){$(".game-over .length").text(t),$(".game-over").show()}$(function(){e.init(function(){$(".game-wrap").css("width",e.backgroundW+2+e.X+2),$("#canvasBg").attr("width",e.backgroundW+2+e.X),$("#canvasBg").attr("height",e.backgroundH+2+e.Y),$("#canvasBg").show(),i.init($("#canvasBg")[0],r),$(".game-control, .game-over").click(function(){$(this).hide(),i.restart()}),$(".wrap-btn").on("touchstart",".btn-left, .btn-right, .btn-up, .btn-down",function(){var t=$(this);t.hasClass("btn-left")?i.onDirectLeft():t.hasClass("btn-right")?i.onDirectRight():t.hasClass("btn-up")?i.onDirectUp():t.hasClass("btn-down")&&i.onDirectDown()})})})},95:function(t,o,n){},97:function(t,o,n){"use strict";var e=n(98).createSnake,i=n(39),r={isGameing:0,init:function(t,o){r.canvas=t,r.context=t.getContext("2d"),r.onGameover=o,r.resetBG(),window.addEventListener("keydown",r.anyKey,!1)},resetBG:function(){r.context.clearRect(i.X,i.Y,i.backgroundW,i.backgroundH),r.context.fillStyle=i.bgColor,r.context.fillRect(i.X,i.Y,i.backgroundW,i.backgroundH),r.context.strokeStyle=i.borderColor,r.context.strokeRect(i.X-1,i.Y-1,i.backgroundW+2,i.backgroundH+2)},restart:function(){1!==r.isGameing&&(r.gameOver(),r.curSnake=e(r.canvas),r.curSnake.randFood(),r.isGameing=1,r.resetBG(),r.timerId=window.setInterval(r.onTimer,i.gameInterval))},gameOver:function(){var t=r.curSnake?r.curSnake.getLength():0;return r.isGameing=0,r.curSnake=null,window.clearInterval(r.timerId),t},game:function(){r.resetBG(),r.curSnake.show()},onTimer:function(){if(0!==r.isGameing)if(1===r.curSnake.upDate()){var t=r.gameOver();"function"==typeof r.onGameover&&r.onGameover(t)}else r.game()},anyKey:function(t){var o=window.event||t,n=o.keyCode||o.which||o.charCode;switch(o.preventDefault(),n){case 37:case 65:r.onDirectLeft();break;case 38:case 87:r.onDirectUp();break;case 39:case 68:r.onDirectRight();break;case 40:case 83:r.onDirectDown()}},onDirectLeft:function(){1!==r.curSnake.curDirection&&(r.curSnake.nextDirection=0)},onDirectRight:function(){0!==r.curSnake.curDirection&&(r.curSnake.nextDirection=1)},onDirectUp:function(){3!==r.curSnake.curDirection&&(r.curSnake.nextDirection=2)},onDirectDown:function(){2!==r.curSnake.curDirection&&(r.curSnake.nextDirection=3)}};t.exports=r},98:function(t,o,n){"use strict";var e=n(39);function i(t,o){return Math.floor((o*e.COL+t)/e.bodyW)}function r(t){return t%e.COL*e.bodyW}function c(t){return Math.floor(t/e.COL)*e.bodyH}function a(t,o,n){var i={};return i.canvas=t,i.x=r(o),i.y=c(o),i.color=n||e.bodyColor,i.isEqual=function(t){return this.x===t.x&&this.y===t.y?1:0},i.copyFrom=function(t){this.x=t.x,this.y=t.y,this.color=t.color},i.rand=function(){var t=Math.floor(Math.random()*e.ROW*e.COL);this.x=r(t),this.y=c(t)},i.show=function(){var t=i.canvas.getContext("2d");t.fillStyle=this.color,t.fillRect(this.x+e.X,this.y+e.Y,e.bodyW,e.bodyH),t.lineWidth=.2,t.strokeStyle="#2BB2BC",t.strokeRect(this.x+e.X,this.y+e.Y,e.bodyW,e.bodyH)},i.wipe=function(){},i.canMoveLeft=function(){return this.x-e.bodyW>=0},i.canMoveRight=function(){return this.x+e.bodyW<e.backgroundW},i.canMoveUp=function(){return this.y-e.bodyH>=0},i.canMoveDown=function(){return this.y+e.bodyH<e.backgroundH},i.moveLeft=function(){return!!this.canMoveLeft()&&(this.x=this.x-e.bodyW,!0)},i.moveRight=function(){return!!this.canMoveRight()&&(this.x=this.x+e.bodyW,!0)},i.moveUp=function(){return!!this.canMoveUp()&&(this.y=this.y-e.bodyH,!0)},i.moveDown=function(){return!!this.canMoveDown()&&(this.y=this.y+e.bodyH,!0)},i}t.exports={createSnake:function(t){var o={};o.canvas=t,o.curDirection=1,o.nextDirection=1,o.food=a(o.canvas,0,e.foodColor),o.wipeBody=a(o.canvas,0),o.isWipeBody=0,o.hashArray=[];for(var n=0;n<e.COL*e.ROW;n++)n<e.initSnakeLength?o.hashArray[n]=1:o.hashArray[n]=0;o.body=new Array(e.initSnakeLength);for(var u=0;u<o.body.length;u++)o.body[u]=a(o.canvas,u);return o.randFood=function(){for(var t=10;t>0;)if(t--,this.food.rand(),0===this.hashArray[i(this.food.x,this.food.y)])return;for(var o=e.COL*e.ROW/2;o<e.COL*e.ROW;o++)if(0===this.hashArray[o])return this.food.x=r(o),void(this.food.y=c(o));for(var n=e.COL*e.ROW/2-1;n>=0;n--)if(0===this.hashArray[n])return this.food.x=r(n),void(this.food.y=c(n))},o.upDate=function(){var t=0;switch(this.nextDirection){case 0:t=this.goLeft();break;case 1:t=this.goRight();break;case 2:t=this.goUp();break;case 3:t=this.goDown()}return this.curDirection=this.nextDirection,1!==t&&(t=this.updateFlag()),t},o.updateFlag=function(){if(1===this.hashArray[i(o.body[o.body.length-1].x,o.body[o.body.length-1].y)]){if(!o.body[o.body.length-1].isEqual(this.food))return 1;var t=a(o.canvas,0);t.x=this.x,t.y=this.y,o.body.unshift(t),this.randFood()}1===this.isWipeBody&&(this.hashArray[i(this.wipeBody.x,this.wipeBody.y)]=0);for(var n=0;n<o.body.length;n++)this.hashArray[i(o.body[n].x,o.body[n].y)]=1;return this.hashArray[i(this.food.x,this.food.y)]=1,0},o.show=function(){1===this.isWipeBody&&(this.wipeBody.wipe(),this.isWipeBody=0);for(var t=0;t<o.body.length;t++)o.body[t].show();this.food.show()},o.goLeft=function(){if(1===this.curDirection)return-1;if(!o.body[o.body.length-1].canMoveLeft())return 1;this.wipeBody.copyFrom(o.body[0]),this.isWipeBody=1;for(var t=0;t<o.body.length-1;t++)o.body[t].copyFrom(o.body[t+1]);return o.body[o.body.length-1].moveLeft(),this.curDirection=0,0},o.goRight=function(){if(0===this.curDirection)return-1;if(!o.body[o.body.length-1].canMoveRight())return 1;this.wipeBody.copyFrom(o.body[0]),this.isWipeBody=1;for(var t=0;t<o.body.length-1;t++)o.body[t].copyFrom(o.body[t+1]);return o.body[o.body.length-1].moveRight(),this.curDirection=1,0},o.goUp=function(){if(3===this.curDirection)return-1;if(!o.body[o.body.length-1].canMoveUp())return 1;this.wipeBody.copyFrom(o.body[0]),this.isWipeBody=1;for(var t=0;t<o.body.length-1;t++)o.body[t].copyFrom(o.body[t+1]);return o.body[o.body.length-1].moveUp(),this.curDirection=2,0},o.goDown=function(){if(2===this.curDirection)return-1;if(!o.body[o.body.length-1].canMoveDown())return 1;this.wipeBody.copyFrom(o.body[0]),this.wipeBody.y=o.body[0].y,this.isWipeBody=1;for(var t=0;t<o.body.length-1;t++)o.body[t].copyFrom(o.body[t+1]);return o.body[o.body.length-1].moveDown(),this.curDirection=3,0},o.getScore=function(){return o.body.length},o.getLength=function(){return o.body.length},o}}}});