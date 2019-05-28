/**
 * Copyright (c) 2018-10-20 Checkson.
 * Licensed under the MIT License (MIT).
 * Github:https://github.com/Checkson/flex-jsonp
 */

;(function () {

  'use strict';

  // Dependent window environment.
  if (typeof window === 'undefined') {
    throw new Error('Flex jsonp needs to run in the window environment!');
  }

  // Jsonp callback function seed.
  var seed = 0;
  // Choose encode type
  var enc = encodeURIComponent;

  // Clean up function.
  var cleanup = function (script, cb, timer) {
    // Remove the script tag.
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
    // Remove jsonp callback function.
    try {
      delete window[cb];
    } catch (e) {
      window[cb] = null;
    }
    // Remove jsonp timeout listener
    if (timer) {
      clearTimeout(timer);
    }
  }

  // Create script and add src
  var createScript = function (url) {
    var script = document.createElement('script'),
        oHead = document.head || document.getElementsByTagName('head')[0];
    script.src = url;
    oHead.appendChild(script);
    return script;
  }

  // Build url params
  var buildUrlParams = function (url, params) {
    var arr = [];
    for (var key in params) {
      arr.push(key + '=' + enc(params[key]));
    }
    var char = url.indexOf('?') > -1 ? '&' : '?';
    return url + char + arr.join('&');
  }

  // Jsonp
  var flexJsonp = function (options) {

    var settings = options || {},
        url = settings.url || '',
        timeout = settings.timeout || 0,
        params = settings.params || {},
        callbackParam = settings.callbackParam || 'cb',
        callback = settings.callback || 'callback'+seed++;

    params[callbackParam] = callback;

    var script = createScript(buildUrlParams(url, params)),
        timer;

    return new Promise(function (resolve, reject) {
        // Timeout
        if (timeout) {
          timer = setTimeout(function () {
            cleanup(script, callback, timer);
            reject(new Error('Timeout'));
          }, timeout);
        }
        // Process the returned data
        window[callback] = function (data) {
          cleanup(script, callback, timer);
          resolve(data);
        }
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    flexJsonp['default'] = flexJsonp;
    module.exports = flexJsonp;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define('flexJsonp', [], function () {
      return flexJsonp;
    });
  } else {
    window.flexJsonp = flexJsonp;
  }

})();