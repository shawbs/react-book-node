/**
 * user 表
 * user_id
 * username
 * password
 * user_group
 */
class User{

    /**
     * Creates an instance of User.
     * @param {any} user_id 
     * @param {any} username 
     * @param {any} pwd 
     * @param {any} user_group 
     * @memberof User
     */
    constructor(username,pwd,user_group){
        this.username = username;
        this.pwd = pwd;
        this.user_group = user_group;
    }
}


module.exports = User