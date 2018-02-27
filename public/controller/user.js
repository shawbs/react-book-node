
const query = require('../sql');


module.exports = {
    
        /**
         * 表:根据用户名查询用户表
         * 
         * @param {string} username 
         * @param {function} cb 
         * @returns 
         */
        fetchByName : function(username,cb){
            if(username == undefined) return;
            let selectSql = 'SELECT * FROM user WHERE username = ?';
            query(selectSql,username,function(err,data,fields){
                cb(err,data,fields)
            })
            
        },
    
        /**
         * 
         * 表：user表新增用户
         * @param {object} user 
         * @param {function} cb 
         */
        insert : function(user,cb){
            console.log(user)
            let insertSql = 'INSERT INTO user(username,password) VALUES (?,?)';
            let insertSql_params = [
                user.username,
                user.password
            ];
            query(insertSql,insertSql_params,function(err,data,fields){
                cb(err,data,fields)
            })

        }
    

    
    };