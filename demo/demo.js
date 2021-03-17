;(function () {
    // DOM
    var oInput = document.getElementById('input'),
        oDropdown = document.getElementById('dropdown'),
        oButton = document.getElementById('button'),
        oSearchTypes = document.getElementById('searchTypes');

    // Variables
    var activeIndex = 0;

    // Search Types Links
    var searchTypes = [
      { title: 'page', link: 'https://www.baidu.com/baidu?ie=utf-8&wd=' },
      { title: 'photo', link: 'https://image.baidu.com/search/index?tn=baiduimage&word=' },
      { title: 'news', link: 'https://news.baidu.com/ns?tn=news&ie=utf-8&word=' },
      { title: 'video', link: 'https://video.baidu.com/v?ie=utf-8&word=' },
      { title: 'map', link: 'https://map.baidu.com/?newmap=1&ie=utf-8&s=s%26wd%3D' }
    ]

    // utils  
    var bindEvent = (function () {
      if (window.addEventListener) {
        return function (el, type, fn) {
          el.addEventListener(type, fn, false);
        }
      } else {
        return function (el, type, fn) {
          el.attachEvent('on'+type, fn);
        }
      }
    })();

    init();

    function init () {
      initSearchTypes();
      initEvent();
    }

    function initSearchTypes () {
      for (var i = 0, len = searchTypes.length; i < len; i++) {
        var a = document.createElement('a');
        if (i === activeIndex) {
          a.className = 'search-type active';
        } else {
          a.className = 'search-type';
        }
        a.innerHTML = searchTypes[i].title;
        a.setAttribute('data-index', i);
        oSearchTypes.appendChild(a);
      }
    }

    function initEvent () {
      // Show Tips When Input.
      bindEvent(oInput, 'keyup', function (e) {
        toggleTips(true);
        var ev = e || window.event;
        var target = e.target || ev.srcElement;
        var val = target.value;
        if (e.keyCode === 13) {
          executeSearch(val);
        } else {
          getTips(val);
        }
      });
      // Hide Tips When Click Document.
      bindEvent(document, 'click', function (e) {
        var ev = e || window.event;
        var target = e.target || ev.srcElement;
        if (target.className === 'tips-item') {
          executeSearch(target.innerHTML);
        } else if (target.className === 'search-type' ) {
          changeSearchType(target);
        } else {
          toggleTips(false);
        }
      });
      // Click Search Button to Search
      bindEvent(oButton, 'click', function (e) {
        executeSearch(oInput.value);
      })
    }

    function executeSearch (keywords) {
      toggleTips(false);
      window.open(searchTypes[activeIndex].link + keywords);
    }

    function changeSearchType (el) {
      var className = el.className;
      if (className.indexOf('active') > -1)  return;
      el.className = className + ' active';
      activeIndex = el.getAttribute('data-index');
      var parentNode = el.parentNode;
      for (var i = 0; i < parentNode.children.length; i++) {
        var childEl = parentNode.children[i]
        if (childEl=== el) continue;
        if (childEl.className.indexOf('active') > -1) {
          childEl.className = className;
        }
      }
    }

    function toggleTips (flag) {
      oDropdown.style.display = flag ? 'block' : 'none';
    }

    function getTips (keywords) {
      flexJsonp({
        url: 'https://suggestion.baidu.com/su',
        params: {
          wd: keywords,
          p: 3,
          t: new Date().getTime()
        },
        callbackParam: 'cb'
      }).then(function (res) {
        responseHandle(res);
      }, function (err) {
        window.console.log(err);
      });
    }

    function responseHandle (res) {
      var tipsList = res.s;
      oDropdown.innerHTML = '';
      if (tipsList.length) {
          for (var i = 0, len = tipsList.length; i < len; i++) {
          var oLi = document.createElement('li');
          oLi.className = 'tips-item';
          oLi.innerHTML = tipsList[i];
          oDropdown.appendChild(oLi);
        } 
      } else {
        var oLi = document.createElement('li');
        oLi.className = 'no-tips';
        oLi.innerHTML = 'No Tips';
        oDropdown.appendChild(oLi);
      }
    }
  })();
