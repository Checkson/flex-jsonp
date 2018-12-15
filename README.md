# flex-jsonp
Support Promise For JSONP;

## demo
[demo](https://checkson.github.io/flex-jsonp/demo.html)

## install
```
npm install flex-jsonp --save
```

## usage
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
