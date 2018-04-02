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
         * 获取热门书藉
         * 
         * @param {string} type 
         * @param {function} cb 
         */
        fetchBookByHot: function(cb){
            let sql = 'SELECT * FROM book WHERE isHot = 1';
            query(sql,undefined,function(err,data,fields){
                if(err){
                    cb(false,err)
                }else{
                    cb(data,'');
                }
            })
        },

        /**
         * 获取推荐书藉
         * 
         * @param {string} type 
         * @param {function} cb 
         */
        fetchBookByRecommend: function(cb){
            let sql = 'SELECT * FROM book WHERE isRecommend = 1';
            query(sql,undefined,function(err,data,fields){
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
            let sql = 'INSERT INTO book(bookname,author,introduction,type,isHot,isRecommend,avatar) VALUES (?,?,?,?,?,?,?)';
            let insertSql_params = [
                book.bookname,
                book.author,
                book.introduction,
                book.type,
                !!book.isHot,
                !!book.isRecommend,
                book.avatar
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
            let sql = 'UPDATE book SET bookname=?,author=?,introduction=?,type=?,isHot=?,isRecommend=?,avatar=? WHERE book_id=?';
            let insertSql_params = [
                book.bookname,
                book.author,
                book.introduction,
                book.type,
                !!book.isHot,
                !!book.isRecommend,
                book.avatar,
                book_id,
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
                // console.log(sql)
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
         * 分页查询book全部
         * @param {number} index 当前页索引
         * @param {number} count 页要显示的条目
         * @param {string} 类型分页 默认为空
         * @param {string} 类型值
         * @return Promise 
         */
        groupbyBook:function(index=1,count=5,type = '',typeValue = ''){
            // console.log(index,count)
            return co(genBookPage(index,count,type,typeValue));
        },


        
}


/**
 * 并发获取book记录数和分布条目
 * 
 * @param {any} index 
 * @param {any} count 
 * @returns generator函数
 */
function* genBookPage(index,count,type,typeValue){

    let sql_groupby;
    let sql_count;
    let parameter1 = null,parameter2 = null;
    if(!!type){
        sql_groupby = 'SELECT * FROM book WHERE ${type}=? LIMIT ?,?';
        sql_count  =`SELECT COUNT(*) FROM book WHERE ${type}=?`;
        parameter1 = typeValue;
    }else{
        sql_groupby = 'SELECT * FROM book LIMIT ?,?';
        sql_count  ='SELECT COUNT(*) FROM book';
    }

    let f1 =  new Promise((resolve,reject)=>{
        query(sql_count,parameter1,function(err,data,fields){
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
        if(!!type){
            parameter2 = [
                typeValue,
                i*count,
                count
            ]
        }else{
            parameter2 = [
                i*count,
                count
            ];
        }
        query(sql_groupby,parameter2,function(err,data,fields){
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


