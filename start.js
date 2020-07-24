const log4js = require('azero-sdk-logger');
const logger = log4js.getLogger('skills');
var app= require('express')();
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
//持久化配置
process.env.DBURL = 'mongodb://127.0.0.1:27017';
process.env.DATABASES = 'azero_skill';
//配置服务端口
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('Example app listening at http://%s:%s', host, port);
  logger.info('nodejs-skills 启动OK');
});


var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(bodyParser.json());
app.post('/skills/:skillId', function (req, res) {//第二个参数是用一种解析方式解析
  let skill = require('./azero/'+req.originalUrl+'/index');
  skill.handler(req.body, null, (error, result) => {
    if(error){
      res.writeHeader(500, {'Content-Type':'application/json;charset=UTF-8'});
      res.end( JSON.stringify(error.message, null, 2));
    }else{
      if(result!=undefined||result!=null){
        res.writeHeader(200, {'Content-Type':'application/json;charset=UTF-8'});
        res.end( JSON.stringify(result, null, 2));
      }else{
        res.writeHeader(500, {'Content-Type':'application/json;charset=UTF-8'});
        res.end( JSON.stringify(result, null, 2));
      }
    }
  });
});
