/**
*	middleware
*	监听当前目录下所有文件路由
*/

const fs = require('fs');
const path = require('path');



/*
*	路由中间件
*/
function addMapping(route,mapping){
	for(let url in mapping){
		console.log(url)
		if(url.startsWith('GET ')){
			let path = url.substring(4);

			Array.isArray(mapping[url]) ? (route.get(path,...mapping[url])) :(route.get(path,mapping[url]));
			
		}else if(url.startsWith('POST ')){
			let path = url.substring(5);
			// route.post(path,mapping[url]);
			Array.isArray(mapping[url]) ? (route.post(path,...mapping[url])) :(route.post(path,mapping[url]));
		}else{
			console.log(`invaild url: ${url}`);
		}
	}
}

/***/
function addController(route,dir){
	let files = fs.readdirSync(dir);
	let js_f = files.filter(f=>{	
		return f !== 'index.js';
	})

	for(let f of js_f){
		let mapping = require(path.join(dir,f));
		addMapping(route,mapping)
	}
}


module.exports = function(app){
	console.log('GET /');
	app.get('/',function(req,res){
		res.end('index')
	})


	addController(app,__dirname);
	
	
	console.log('GET *');
	app.get('*',function(req,res){
		res.end('404 not found')
	})

	
}
