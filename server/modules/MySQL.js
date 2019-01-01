/**
 * Created by nnnyyy on 2018-04-12.
 */
var mysql = require('mysql');
var fs = require('fs');

class Mysql {
    constructor() {
        this.init();
    }

    init() {
        const configPath = __dirname + '/../../config/config.json';
        const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: parsed.dbhost,
            user: parsed.user,
            password: parsed.password,
            database: parsed.database,
            multipleStatements: true
        });
    }
}

const _module = new Mysql();

module.exports = _module.pool;
