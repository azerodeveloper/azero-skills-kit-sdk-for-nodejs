var app= require('express')();
var express= require('express');
// 引入json解析中间件
var bodyParser = require('body-parser');


//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//配置服务端口
var server = app.listen(4001, function () {
  var host = server.address().address;
  var port = server.address().port;
})

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
app.post('/azero/:skillId', function (req, res) {//第二个参数是用一种解析方式解析
  // console.log(req.body);//{ age: '20', name: 'lambo' }---body是从客户端传过来的参数
  res.writeHeader(200, {'Content-Type':'application/json;charset=UTF-8'});
  let skill = require('./'+req.originalUrl);
  skill.handler(req.body, null, (error, result) => {
    var json = JSON.stringify(result, null, 2);
    res.end(json);
  });
});


