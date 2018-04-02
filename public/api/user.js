
/**
*	user api
*/


const  util = require('../script/common');

const User = require('../module/user');
const UserControl = require('../controller/user');

/**
 * 后台登录
 * 
 * @param {any} req {username,password}
 * @param {any} res 
 * @returns 
 */
const fn_admin_login = function (req, res)  {
	let {username,password} = req.body;

	if(!username || !password){
		res.json({state:false,message:"参数错误",errorCode:10001});
		return;
	}
	
	UserControl.fetchByName(username,(err,data)=>{
		if(err){
			res.json({state:false,message:'未知错误'});
			console.error(err);
			return;
		}

		if(data.length == 0){
			res.json({state:false,message:"帐户不存在"});
			return;
		}

		if(data[0].user_group == 'admin'){
			
			if(password === data[0].password){
				let result = util.ArrFilter(data,['password,user_id']);
				res.json({state:true,data:result[0],token: util.getJwt()});
			}else{
				res.json({state:false,message:"密码错误"});
			}

		}else{
			res.json({state:false,message:"无权限登录"});
		}

	});
}

/**
 * 登录接口
 * 
 * @param {any} req 
 * @param {any} res 
 * @returns 
 */
const fn_login = function(req,res){
	let {username,password} = req.body;
	
	if(!username || !password){
		res.json({state:false,message:"参数错误",errorCode:10001});
		return;
	}
	UserControl.fetchByName(username,(err,data)=>{
		if(err){
			res.json({state:false,message:'未知错误'});
			console.error(err);
			return;
		}

		if(data.length == 0){
			res.json({state:false,message:"帐户不存在",errorCode:10001});
			return;
		}

		if(password === data[0].password){
			let result = util.ArrFilter(data,['password','user_id']);
			if(req.body.remember){
				res.cookie('rememberme', username, { expires: 0, httpOnly: true, signed: true });
			}
			res.json({state:true,data:result[0],token: util.getJwt(),message:'登录成功'});
			
		}else{
			res.json({state:false,message:"密码错误"});
		}
	})
}


/**
 * 用户注册
 * 
 * @param {any} req {username,password}
 * @param {any} res 
 * @returns 
 */
const  fn_register = function(req,res){
	let {username,password} = req.body;
	if(!username || !password){
		res.json({state:false,message:"参数错误",errorCode:10001});
		return;
	}

	let user = new User(
		username,
		password
	)

	UserControl.insert(user,(err,data)=>{
			if(err){
				if(err.errno==1062){
					res.json({state:false,message:'用户已注册'})
				}else{
					res.json({state:false,message:'未知错误'});
				}
				console.error(err);
				return;
			} 
			res.json({state:true,message:'注册成功！'});
	})
}

/**
 * 刷新令牌
 * @param {any} req {token}
 * @param {any} res 
 */
const refreshAccessToken = function(req,res){
	let {accessToken} = req.body;
	let {decoded,exType} = util.verifyToken(accessToken);
	let _token = util.getJwt();
	if(exType.exType == 1 || exType.exType == 2){
        res.json({state:true,token: _token, message:''})
    }else{
        res.json({state:false,message:'入参错误'});
    }	
}

/**
 * 添加token验证路由,添加到需要验证的路由中间件中
 * @param {*} req 
 * @param {*} res 
 */
const httpVerifyToken = function(req,res){
	let {accessToken} = req.body;
	let {decoded,exType} = util.verifyToken(accessToken);
    if(exType != 1){
        res.json({state:false,message:'invalid token'})
    }else{
        res.next();
    }
}

const verifyLogin = function(req,res){
	let c = req.cookies
	console.log(c)
	if(c){
		res.json({state: true,data:null,message:''})
	}else{
		res.json({state: false,message:'登录过期'})
	}
}

/**
 * 用户退出
 * 
 * @param {any} req {}
 * @param {any} res 
 */
const fn_login_out = function(req,res){
	res.clearCookie('rememberme');
	res.json({state:true,message:'用户已退出'})
}

module.exports = {
	'POST /sg/admin/login': fn_admin_login,
	'POST /sg/user/login': fn_login,
	'POST /sg/user/register': fn_register,
	'POST /sg/refreshAccessToken': refreshAccessToken,
	'GET /sg/exit':fn_login_out,
	'GET /sg/verifyLogin': verifyLogin
}