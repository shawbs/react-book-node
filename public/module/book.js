/**
 * book表
 * book_id
 * bookname
 * author
 * introduction
 * type
 * createAt
 * updateAt
 */

class Book {
    /**
     * Creates an instance of Book.
     * @param {any} bookname 
     * @param {any} author 
     * @param {any} introduction 
     * @param {any} type 
     * @memberof Book
     */
    constructor(bookname,author,introduction,type){
        this.bookname = bookname;
        this.author = author;
        this.introduction = introduction;
        this.type = type
    }
}




module.exports = Book