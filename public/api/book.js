
const Book = require('../module/book');
const BookControl = require('../controller/book');

const upload = require('../script/fileupload');
const conf = require('../config/conf');


const bookEdit = function(req,res){ //1508722143960
    let _book = req.body;
    let book = new Book(
        _book.bookname,
        _book.author,
        _book.introduction,
        _book.type,
        !!_book.isHot,
        !!_book.isRecommend,
        _book.avatar
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
    let count = 5;
    let ex_type = req.query.ex_type || '';
    let type_value = req.query.type_value || '';
    BookControl.groupbyBook(index,count,ex_type,type_value).then(vals=>{
        res.json({state:true,data:vals})
    }).catch(err=>{
        console.error(err)
        res.json({state:false,message:'未知错误'})
    })
}

const getbookbytype = function(req,res){
    let type = req.query.type;
    BookControl.fetchBookByType(type,function(data,msg){
        if(data){
            res.json({state:true,data:data,msg:''})
        }else{
            res.json({state:false,msg:msg})
        }
    })
}

const getbookbyname = function(req,res){
    let name = req.query.name;
    BookControl.fetchBookByName(name,function(data,msg){
        if(data){
            res.json({state:true,data:data,msg:''})
        }else{
            res.json({state:false,msg:msg})
        }
    })
}



const bookAdd = function(req,res){
    console.log('insert----------------------')
    console.log(req.body)
    let _book = req.body;
    let book = new Book(
        _book.bookname,
        _book.author,
        _book.introduction,
        _book.type,
        !!_book.isHot,
        !!_book.isRecommend,
        _book.avatar
    )
    BookControl.addBook(book,(data,msg)=>{
        if(data){
            res.json({state:true,message:'添加成功'});
		}else{
            res.json({state:true,message:msg})
        }
    })
    console.log('insert----------------------')
}

const bookupload_first =  upload({
        path:conf[conf.env].book_upload_path,
        type:'txt'
    }).array('books')

const bookupload = function(req,res,next){
    console.log('upload------------------------')
    console.log(req.files)
    let files = req.files;
    if(Array.isArray(files) && files.length > 0){
        res.json({state:true,message:'文件上傳成功'})
    }else{
        res.json({state:false,message:'上传文件为空'})
    }
    console.log('upload end------------------------')
}

const bookavatarupload_step1 =  upload({
    path:conf[conf.env].book_avatar_upload_path,
    type:'img'
}).single('bookavatar')

const bookavatarupload = function(req,res,next){
console.log('upload------------------------')
console.log(req.file)
let file = req.file;
if(file){
    res.json({state:true,message:'文件上傳成功',data: conf[conf.env].book_avatar_upload_path + '/' + file.filename})
}else{
    res.json({state:false,message:'上传文件为空'})
}
console.log('upload end------------------------')
}


const fetchBookByHot = function(req,res){
    BookControl.fetchBookByHot((err,data)=>{
        if(err){
            res.json({state:false,message:'未知错误'});
            console.error(err);
        }else{
            res.json({state:true,data:data,message:''});
        }
    });
}

const fetchBookByRecommend = function(req,res){
    BookControl.fetchBookByRecommend((err,data)=>{
        if(err){
            res.json({state:false,message:'未知错误'});
            console.error(err);
        }else{
            res.json({state:true,data:data,message:''});
        }
    });
}

module.exports = {
    'GET /sg/getbook/forpage':getbookbypage,

    'POST /sg/book/edit':bookEdit,
    'POST /sg/book/add':bookAdd,
    'GET /sg/book/delete':bookDelete,
    'POST /sg/book/delete/more':bookDeleteMore,
    'POST /sg/book/bookupload':[bookupload_first,bookupload],
    'POST /sg/book/bookupload/avatar':[bookavatarupload_step1,bookavatarupload],
    'GET /sg/book/fetchBookByHot': fetchBookByHot,
    'GET /sg/book/fetchBookByRecommend': fetchBookByRecommend
}