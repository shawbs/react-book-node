

const BookControl = require('../controller/book');

const  util = require('../script/common');


/**
 * 重定向到首页路由
 * 
 * @param {any} req 
 * @param {any} res 
 */
const admin_index = function(req,res){
    
    res.redirect('/admin/book.htm');
}

/**
 * 后台首页路由
 * 
 * @param {any} req 
 * @param {any} res 
 */
const admin_book_index = function(req,res){

    let page = req.query.page || 1;
    BookControl.groupbyBook(page).then(vals=>{
        res.render('index',{name:'managebook',data:JSON.stringify(vals)})
    }).catch(err=>{
        console.error(err);
    })

    
}

/**
 * 
 * 
 * @param {any} req 
 * @param {any} res 
 */
const admin_book_add = function(req,res){
    res.render('index',{name:'addbook',bookdata:[{}]})
}

const admin_book_edit = function(req,res){
    BookControl.fetchBookById(req.params.id,(err,data)=>{
        if(err){
            console.error(err);
            return;
        }
        res.render('index',{name:'editbook',bookdata:data})
    })
}


const admin_login = function(req,res){
    res.render('./page/login')
}

/**
 *token验证
 * @param {*} req 
 * @param {*} res 
 */
const verifyToken = function(req,res){
	let {accessToken} = req.body;
	let {decoded,exType} = util.verifyToken(accessToken);
    if(exType != 1){
        res.json({state:false,message:'invalid token'})
    }else{
        res.json({state:true,msg:''});
    }
}

module.exports = {
    'GET /admin.htm':admin_index,
    'GET /admin/book.htm':admin_book_index,
    'GET /admin/book/addbook.htm':admin_book_add,
    'GET /admin/book/editbook.htm/:id':admin_book_edit,
    'GET /admin/login.htm':admin_login
}
