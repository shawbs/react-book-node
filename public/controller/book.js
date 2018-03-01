const co = require('co');

const query = require('../sql');

module.exports = {
       
        /**
         * 获取全部书藉
         * 
         * @param {any} cb 
         */
        fetchBook:function(cb){
            let sql = 'SELECT * FROM book';
            query(sql,undefined,function(err,data,fields){
                cb(err,data,fields)
            })
        },
    
        /**
         * 通过id获取书藉
         * 
         * @param {any} book_id 
         * @param {any} cb 
         */
        fetchBookById:function(book_id,cb){
            let sql = 'SELECT * FROM book WHERE book_id = ?';
            query(sql,book_id,function(err,data,fields){
                cb(err,data,fields)
            })
        },
    
        /**
         * 通过bookname获取书藉
         * 
         * @param {string} bookname 
         * @param {function} cb 
         */
        fetchBookByName:function(bookname,cb){
            let sql = 'SELECT * FROM book WHERE bookname = ?';
            query(sql,bookname,function(err,data,fields){
                if(err){
                    cb(false,err)
                }else{
                    cb(data,'');
                }
            })
        },

        /**
         * 通过type获取书藉
         * 
         * @param {string} type 
         * @param {function} cb 
         */
        fetchBookByType:function(type,cb){
            let sql = 'SELECT * FROM book WHERE type = ?';
            query(sql,type,function(err,data,fields){
                if(err){
                    cb(false,err)
                }else{
                    cb(data,'');
                }
            })
        },
    
        /**
         * 新增书藉
         * 
         * @param {any} book 
         * @param {any} cb 
         */
        addBook:function(book,cb){
            let sql = 'INSERT INTO book(bookname,author,introduction,type,isHot,isRecommend) VALUES (?,?,?,?,?,?)';
            let insertSql_params = [
                book.bookname,
                book.author,
                book.introduction,
                book.type,
                !!book.isHot,
                !!book.isRecommend
            ];
            query(sql,insertSql_params,function(err,data,fields){
                if(err){
                    if(err.errno==1062){
                        cb(false,'书名已存在');
                    }else{
                        cb(false,'未知错误');
                    }
                    console.error(err);
                }else{
                    cb(data,fields)
                }
                
            })
        },
        /**
         * 更新书藉信息
         * 
         * @param {any} book_id 
         * @param {any} book 
         * @param {any} cb 
         */
        editBook:function(book_id,book,cb){
            let sql = 'UPDATE book SET bookname=?,author=?,introduction=?,type=?,isHot=?,isRecommend=? WHERE book_id=?';
            let insertSql_params = [
                book.bookname,
                book.author,
                book.introduction,
                book.type,
                !!book.isHot,
                !!book.isRecommend,
                book_id
            ];
            query(sql,insertSql_params,function(err,data,fields){
                cb(err,data,fields)
            })
        },

        /**
         * 删除book
         * 
         * @param {string/array} ids :string删除单条，:array删除多条
         * @param {any} cb 
         */
        removeBook:function(ids,cb){
            let sql = 'DELETE FROM book WHERE book_id=?';
            if(Array.isArray(ids)){
                if(ids.length > 1){
                    for(var i =1;i<ids.length;i++){
                        sql+=' or book_id=?'
                    }
                }
                console.log(sql)
                query(sql,ids,function(err,data,fields){
                    cb(err,data,fields)
                })
            }else{
                query(sql,[ids],function(err,data,fields){
                    cb(err,data,fields)
                })
            }
            
        },

        /**
         * 
         * 分页查询book
         * @param {number} index 当前页索引
         * @param {number} 第页要显示的条目
         * @return Promise 
         */
        groupbyBook:function(index=1,count=5){
            // console.log(index,count)
            return co(gen(index,count));
        }


        
}


/**
 * 并发获取book记录数和分布条目
 * 
 * @param {any} index 
 * @param {any} count 
 * @returns generator函数
 */
function* gen(index,count){

    let sql_groupby = 'SELECT * FROM book LIMIT ?,?';
    let sql_count  ='SELECT COUNT(*) FROM book';
    

    let f1 =  new Promise((resolve,reject)=>{
        query(sql_count,undefined,function(err,data,fields){
            if(err) reject(err);
            if(typeof data != 'undefined'){
                let total = data[0]['COUNT(*)'];
                let pageNum = Math.ceil(total/count);
                resolve({index:index,total:total,page:pageNum})
            }else{
                resolve({index:0,total:0,page:0})
            }
        });

    })

    
    let f2 =  new Promise((resolve,reject)=>{
        let i = index-1;
        let sqlparams = [
            i*count,
            count
        ];
        query(sql_groupby,sqlparams,function(err,data,fields){
            if(err) reject(err);
            if(typeof data != 'undefined'){
                resolve(data)
            }else{
                resolve([])
            }
        });

    })


    let res = yield {
        data:f2,
        other:f1
    }
    return res;
}