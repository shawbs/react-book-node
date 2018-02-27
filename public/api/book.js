
const Book = require('../module/book');
const BookControl = require('../controller/book');

const upload = require('../script/fileupload');



const bookEdit = function(req,res){ //1508722143960
    let _book = req.body;
    let book = new Book(
        _book.bookname,
        _book.author,
        _book.introduction,
        _book.type
    )
    BookControl.editBook(_book.book_id,book,(err,data)=>{
        if(err){
            res.json({state:false,message:'未知错误'});
            console.error(err);
			return;
		}
        res.json({state:true,message:'修改成功'});
    })
}

const bookDelete = function(req,res){
    let id = req.query.id;
    BookControl.removeBook(id,(err,data)=>{
        if(err){
            res.json({state:false,message:'未知错误'});
            console.error(err);
        }else{
            res.json({state:true,message:'删除成功'});
        }
    })
}

const bookDeleteMore = function(req,res){
    let arr_id = req.body.ids;
    BookControl.removeBook(arr_id,(err,data)=>{
        if(err){
            res.json({state:false,message:'未知错误'});
            console.error(err);
        }else{
            res.json({state:true,message:'删除成功'});
        }
    })
}

const getbookbypage = function(req,res){
    let index = req.query.page|| 1;
    BookControl.groupbyBook(index,5).then(vals=>{
        res.json({state:true,data:data})
    }).catch(err=>{
        console.error(err)
        res.json({state:false,message:'未知错误'})
    })
}

const bookupload = function(req,res,next){
    console.log('upload------------------------')
    console.log(req.files)
    let files = req.files;
    if(Array.isArray(files) && files.length > 0){
        // res.json({state:true,message:'文件上傳成功'})
        next();
    }else{
        res.json({state:false,message:'上传文件为空'})
    }
    console.log('upload end------------------------')
}

const bookAdd = function(req,res){
    console.log('insert----------------------')
    console.log(req.body)
    let _book = req.body;
    let book = new Book(
        _book.bookname,
        _book.author,
        _book.introduction,
        _book.type
    )
    BookControl.addBook(book,(err,data)=>{
        if(err){
            if(err.errno==1062){
                res.json({state:false,message:'书名已存在'});
            }else{
                res.json({state:false,message:'未知错误'});
            }
            console.error(err);
			return;
		}
        res.json({state:true,message:'添加成功'});
    })
    console.log('insert----------------------')
}

module.exports = {
    'GET /getbookbypage':getbookbypage,
    'POST /bookedit':bookEdit,
    'POST /bookadd':bookAdd,
    'GET /delete':bookDelete,
    'POST /deleteMore':bookDeleteMore,
    'POST /bookupload':[upload,bookupload,bookAdd]
}