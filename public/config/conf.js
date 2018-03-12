
module.exports = {
    env: 'dev',
    dev: {
        port:8090,
        host: 'http://127.0.0.1:8090',
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads/book',
        book_avatar_upload_path:process.cwd() + '/uploads/book/avatar'
    },
    prod: {
        port:8090,
        //服务器上传目录
        book_upload_path:process.cwd() + '/uploads/book',
        book_avatar_upload_path:process.cwd() + '/uploads/book/avatar'
    }
}