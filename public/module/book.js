/**
 * book表
 * book_id
 * bookname-书名
 * author-作者
 * introduction-简介
 * type-类型
 * isHot-是否热门
 * isRecommend-是否推荐
 * createAt
 * updateAt
 */

class Book {
    /**
     * Creates an instance of Book.
     * @param {string} bookname 
     * @param {string} author 
     * @param {string} introduction 
     * @param {string} type 
     * @param {boolean} isHot 
     * @param {boolean} isRecommend 
     * @memberof Book
     */
    constructor(bookname,author,introduction,type,isHot,isRecommend){
        this.bookname = bookname;
        this.author = author;
        this.introduction = introduction;
        this.type = type;
        this.isHot = isHot;
        this.isRecommend = isRecommend
    }
}




module.exports = Book