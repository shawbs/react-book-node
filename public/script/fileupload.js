const multer = require('multer');


const getMulter = function(option){
    return multer({
        storage:multer.diskStorage({
            //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
            //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
            destination: option.path,
            //TODO:文件区分目录存放
            //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
            filename: function (req, file, cb) {
                var _filename = req.body.filename;
                var fileFormat =(file.originalname).split(".");
                if(!_filename){
                    _filename = fileFormat[0];
                }
                cb(null, _filename + "." + fileFormat[fileFormat.length - 1]);
            }
        }),
        //其他设置请参考multer的limits
        fileFilter: function(req, file, cb){
            // console.log(file)
            if(!option.type) return;
            switch(option.type){
                case 'img': if(/(jpg|jpeg|png|JPG|PNG)$/.test(file.mimetype)){
                                cb(null, true);
                            }else{
                                cb(null, false);
                            }
                            break;
                case 'jpgimg': if(/(jpg|jpeg)$/.test(file.mimetype)){
                                cb(null, true);
                            }else{
                                cb(null, false);
                            }
                            break;           
                case 'txt': if('text/plain'==file.mimetype){
                                cb(null, true);
                            }else{
                                cb(null, false);
                            }
                            break;
                default: cb(null, true);
            }
            
        }
    });
}

module.exports = getMulter;