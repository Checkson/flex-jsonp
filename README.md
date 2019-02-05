# flex-jsonp
Support Promise For JSONP, Compatible with ie5+;

## demo
[demo](https://checkson.github.io/flex-jsonp/demo/demo.html)

## install
```
npm install flex-jsonp --save
```

## suggest usage to Compatible ie5+
```javascript
flexJsonp({
  url: 'http://suggestion.baidu.com/su',
  params: {
    wd: keywords,
    p: 3,
    t: new Date().getTime()
  },
  callbackParam: 'cb'
}).then(function (res) {
  console.log(res);
}, function (err) {
  console.log(err);
});
```

## chain usage
```javascript   
flexJsonp({
  url: 'http://suggestion.baidu.com/su',
  params: {
    wd: keywords,
    p: 3,
    t: new Date().getTime()
  },
  callbackParam: 'cb'
}).then(function (res) {
  console.log(res);
}).catch(function (err) {
  console.log(err);
});
```

## parameters
names | type | default | explain
:---:|:---:|:---:|:---:
url | string | '' | The url requested by JSONP
params | object | {} | Request parameters
timeout | number | 0 | Request timeout setting
callbackParam | string | 'cb' | JSONP callback function parameter name
callback | string | 'callback'+${seed} |  JSONP callback function name

## License
MIT
