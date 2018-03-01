
module.exports = {
    env: 'dev',
    dev: {
        port:8090,
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads/book'
    },
    prod: {
        port:8090,
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads/book'
    }
}