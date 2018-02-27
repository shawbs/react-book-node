
/**
*	user api
*/

const jwt = require('jsonwebtoken');
const  util = require('../script/common');

const User = require('../module/user');
const UserControl = require('../controller/user');
/**
 * 用户登录
 * 
 * @param {any} req {username,password}
 * @param {any} res 
 * @returns 
 */
const fn_login = function (req, res)  {
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

		//后台登录
		if(req.body.type == 1){

			if(data[0].user_group == 'admin'){

				if(password === data[0].password){
					let token = util.getJwt(password);
					let result = util.ArrFilter(data,['password,user_id']);
					res.json({state:true,data:result[0],token:token});
				}else{
					res.json({state:false,message:"密码错误",errorCode:10001});
				}

			}else{
				res.json({state:false,message:"非管理组用户不能登录"});
			}
		}
		//普通登录
		else
		{
			if(password === data[0].password){
				let token = util.getJwt(password);
				let result = util.ArrFilter(data,['password','user_id']);
				res.json({state:true,data:result,token:token});
			}else{
				res.json({state:false,message:"密码错误"});
			}
		}

		
		
		
	
	});
	


};
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
 * 登录验证
 * 
 * @param {any} req {token}
 * @param {any} res 
 */
const loginverify = function(req,res){
	let token = req.body.token;
}
/**
 * 用户退出
 * 
 * @param {any} req {}
 * @param {any} res 
 */
const fu_login_out = function(req,res){
	res.json({state:true,message:'用户已退出'})
}

module.exports = {
	'POST /login': fn_login,
	'POST /register': fn_register,
	'POST /gettoken': loginverify,
	'GET /loginout':fu_login_out
}