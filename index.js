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
  // Judge if support promise.
  var _Promise = typeof Promise === 'undefined' ? null : Promise;
  // Choose encode type
  var enc = encodeURIComponent;

  // If Not Support Promise
  if (!_Promise) {
    // Define Bind Function
    if (!Function.prototype.bind) {
      Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
          ? this
          : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
      };
    }
    // Define Promise By Self
    var MyPromise = function (fn) {
      this.val = undefined;
      this.status = 'pending';
      this.resolveFn = function () {};
      this.rejectFn = function () {};
      fn(this.resolve.bind(this), this.reject.bind(this));
    }
    // Define Promise Resolve
    MyPromise.prototype.resolve = function (newVal) {
      if (this.status !== 'pending') return;
      var _this = this;
      _this.status = 'fulfilled';
      _this.val = newVal;
      setTimeout(function () {
        _this.resolveFn && _this.resolveFn(_this.val);
      }, 0)
    }
    // Define Promise Reject
    MyPromise.prototype.reject = function (newVal) {
      if (this.status !== 'pending') return;
      var _this = this;
      _this.status = 'rejected';
      _this.val = newVal;
      setTimeout(function () {
        _this.rejectFn && _this.rejectFn(_this.val);
      }, 0)
    }
    // Define Promise Then
    MyPromise.prototype.then = function (resolveFn, rejectFn) {
      var _this = this;
      return new _this.constructor (function (nextResolve, nextReject) {
        
        var nextResolveFn,
            nextRejectFn;  

        resolveFn && (nextResolveFn = function () {
          var res = resolveFn(_this.val);
          if (res && res instanceof _this.constructor) {
            res.then(nextResolve, nextReject);
          } else {
            nextResolve(res);
          }
        })

        rejectFn && (nextRejectFn = function () {
          var res = rejectFn(_this.val);
          if (res && res instanceof _this.constructor) {
            res.then(nextResolve, nextReject);
          } else {
            nextResolve(res);
          }
        });

        _this.resolveFn = nextResolveFn;
        _this.rejectFn = nextRejectFn;
      });
    }
    // Define Promise catch
    MyPromise.prototype['catch'] = function (rejectFn) {
      return this.then(null, rejectFn);
    }
    // Promise transfrom
    _Promise = MyPromise;
  }

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

    return new _Promise(function (resolve, reject) {
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