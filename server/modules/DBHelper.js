/**
 * Created by nnnyy on 2018-11-27.
 */

class DBHelper {
    constructor() {
        this.sql = require('./MySQL');
        this.init();
    }

    init() {
    }

    login(id, pw, ip, cb) {
        try {
            cb({ret: 0});
        }catch(e) {
            console.log("login", e);
        }
    }    
}


const _obj = new DBHelper();
module.exports = _obj;