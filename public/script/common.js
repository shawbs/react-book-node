
const jwt = require('jsonwebtoken');
const md5 = require('md5');
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

const getJwt = function(privateKey){
    let token = jwt.sign(
        {
            content:'我是一段黑暗中的文字',
            iat:Math.floor(Date.now() / 1000) - 30
        }, md5(privateKey),
        {
            expiresIn:60*60*24 //24小时到期
        }
    )
    return token;
}

module.exports = {
    ArrFilter,
    getJwt
}