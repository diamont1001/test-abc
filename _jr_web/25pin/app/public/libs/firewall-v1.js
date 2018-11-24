(function () {
  'use strict';
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  var _GREEN_DOMAIN_ = [
    '25pin.com',
    '25ping.com',
    '100.84',
    '127.0',
    'localhost',
  ];

  Object.defineProperties(Function.prototype, {
    call: {
      value: Function.prototype.call,
      writable: false,
      enumerable: true,
      configurable: false
    },
    apply: {
      value: Function.prototype.apply,
      writable: false,
      enumerable: true,
      configurable: false
    }
  });

  function domainCheck(url) {
    var passFlag = false;
    _GREEN_DOMAIN_.forEach(function (domain) {
      var re = new RegExp(domain, 'i');
      if (re.test(url)) passFlag = true;
    });
    return passFlag;
  }

  function getRootUrl(url) {
    if (!url) {
      return url;
    }
    url = url.toString() || '';
    url = url.replace(/^(.*\/\/[^\/?#]*).*$/, '$1') || '';
    url = url.replace(/^(https?|http):\/\//, '') || '';
    return url;
  }

  function killInserted(dom) {
    if (! dom) return;

    if (dom.parentNode) {
      dom.parentNode.removeChild(dom);
    } else if (dom.remove instanceof Function) {
      dom.remove();
    }
  }

  document.write = function () {
    return;
  };
  var keys = Object.keys;

  function installHook(window) {
    var rawFn = window.Element.prototype.setAttribute;

    window.Element.prototype.setAttribute = function (name, value) {
      var that = this;
      if (/(script)|(iframe)|(frame)/i.test(this.tagName) &&
        /^src$/i.test(name) && !domainCheck(value)) {
        this.setAttribute('data-waitDel', true);
        this.style.display = 'none';
        return;
      }

      rawFn.apply(this, arguments);
    };

    window.addEventListener('load', function () {
      var delEleList = Array.prototype.slice.apply(document.querySelectorAll('[data-waitDel]'));
      delEleList.forEach(function (item) {
        killInserted(item);
      });
    }, false);
  }

  installHook(window);

  try {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var nodes = mutation.addedNodes;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if (/(script)|(iframe)|(frame)/i.test(node.nodeName)) {
            if (node.src) {
              if (!domainCheck(node.src)) {
                killInserted(node);
              }
            } else {
              if (/script/i.test(node.nodeName)) {
                var jsTxt = node.innerText.trim();
                if (!/^(define\()|^(\!function\(context)|^(var _uca_o)|^(!function\(\){var a=navigator.userAgent)|^(\(function\(\)\{var match)|^\!function\(\)\{function e\(\)\{var e=location\.host|^(var GLOABLE_CONFIG)/.test(jsTxt) && jsTxt) {
                  killInserted(node);
                }
              }
            }
          }
        }
      });
    });

    observer.observe(document, {
      subtree: true,
      childList: true
    });
  } catch (e) {
    console.error(e.message);
  }

  document.addEventListener('DOMNodeInserted', function (e) {
    if (/(script)|(iframe)|(frame)/i.test(e.target.tagName)) {
      if (/(iframe)|(frame)/i.test(e.target.tagName)) {
        installHook(e.target.contentWindow);
      }

      if (e.target.src && !domainCheck(e.target.src)) {
        killInserted(e.target);
      }
    }
  }, true);
})();