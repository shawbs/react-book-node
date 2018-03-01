
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = md5('sgdy$');
/**
 * 过滤数组中指定key的项
 * 
 * @param {array} Arr 说明：数组只能是一级数组和一级对象数组
 * @param {string/array} key 
 * @return array
 */
const ArrFilter = function(Arr,key){
    let result = [];
    for(let item of Arr){
        if(Object.prototype.toString.call(item) == "[object Object]"){
            let o = {};
            for(let k in item){
                if(Array.isArray(key)){
                    if(key.indexOf(k) == -1) o[k] = item[k];
                }else{
                    if(k != key) o[k] = item[k];
                }

            }
            result.push(o);
        }else{
            if(Array.isArray(key)){
                if(key.indexOf(item) == -1) result.push(item);
            }else{
                if(item != key) result.push(item);
            }
        }
    }
    return result;
    
}

/**
 * 生成token
 * @param {number} hours 
 */
const getJwt = function(hours){
    hours = hours || 1;
    let token = jwt.sign(
        {
            content:'sg小说书库',
            iat:Math.floor(Date.now() / 1000) + (60 * 60),
        }, md5(secret),
        {
            expiresIn:hours*60*60 //1小时到期
        }
    )
    return token;
}

/**
 * 验证token
 * @param {string} token 
 */
const verifyToken = function(token){
    var decoded
    try {
        decoded = jwt.verify(token, md5(secret));
    } catch(err) {
        // err
        decoded = null;
    }
    return decoded;
}

/**
 * 添加路由token验证
 * @param {*} req 
 * @param {*} res 
 */
const httpVerifyToken = function(req,res){
    let {accessToken} = req.body;
    if(!verifyToken(accessToken)){
        res.json({state:false,message:'invalid token'})
    }else{
        res.next();
    }
}

module.exports = {
    ArrFilter,
    getJwt,
    verifyToken,
    httpVerifyToken
}