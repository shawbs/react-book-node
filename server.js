const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const _ = require('underscore');

const conf = require('./public/config/conf');
const url = conf.path;
const port = process.env.PORT || conf[conf.env].port;

app.use(cookieParser('secret'));
app.set('views', path.join(__dirname,'src'));
app.set('view engine', 'ejs');
//静态资源请求路径
app.use(express.static(path.join(__dirname)));

// 添加json解析中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-requested-with,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
	next();
});


 
app.listen(port,()=>{
	console.log(`server runing on http://127.0.0.1:${port}`);
});
	
require('./public/api')(app);



