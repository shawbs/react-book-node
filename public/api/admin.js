

const BookControl = require('../controller/book');



/**
 * 
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
const loginVerify = function(req,res,next){
    if(!req.session.account){
        res.redirect('/admin/login')
    }else{
        next();
    }
}
/**
 * 重定向到首页路由
 * 
 * @param {any} req 
 * @param {any} res 
 */
const admin_index = function(req,res){
    
    res.redirect('/admin/book');
}

/**
 * 后台首页路由
 * 
 * @param {any} req 
 * @param {any} res 
 */
const admin_book_index = function(req,res){

    let page = req.query.page || 1;
    console.log(req.session)
    BookControl.groupbyBook(page).then(vals=>{
        res.render('index',{name:'managebook',account:req.session.account,data:JSON.stringify(vals)})
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
    res.render('index',{name:'addbook',account:req.session.account,bookdata:[{}]})
}

const admin_book_edit = function(req,res){
    BookControl.fetchBookById(req.params.id,(err,data)=>{
        if(err){
            console.error(err);
            return;
        }
        res.render('index',{name:'editbook',account:req.session.account,bookdata:data})
    })
}


const admin_login = function(req,res){
    res.render('./page/login')
}

module.exports = {
    'GET /admin/':admin_index,
    'GET /admin/book':admin_book_index,
    'GET /admin/book/addbook':admin_book_add,
    'GET /admin/book/editbook/:id':admin_book_edit,
    'GET /admin/login':admin_login
}
