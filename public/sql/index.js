const mysql=require("mysql");  
const conf = require('../config/conf_database'); 

const pool = mysql.createPool(conf);

const query=function(sql,sqlparams,callback){  
    pool.getConnection(function(err,conn){  
        if(err){  
            console.error(err);  
        }else{  
            try {
                conn.query(sql,sqlparams,function(qerr,vals,fields){  
                    //释放连接  
                    conn.release();  
                    //事件驱动回调  
                    // if(qerr) throw new Error(error)
                    callback(qerr,vals,fields);  
                });  
                
            } catch (err) {
                console.error(err)
            }
            
        }  
    });  
}; 

module.exports = query;