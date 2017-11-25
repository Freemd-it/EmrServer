var mysql = require('mysql');
var config = require('../Common/Config.js');
var util = require('util');

var DBService = function(){};

DBService.Init = function () {

    this._pool = mysql.createPool({
        host: config.storeConfig.mysqlHost,
        user: config.storeConfig.mysqlUser,
        password: config.storeConfig.mysqlPassword,
        database: config.storeConfig.mysqlDatabase,
        connectionLimit: config.storeConfig.ConnectionLimit,
    });

    // 사용 가능한 커넥션이 없을경우
    this._pool.on('enqueue', function () {
        console.log(util.format("## Waiting for available connection slot ##"));
    });

    console.log(util.format('## mysql connected ##'));
};

DBService.Query = function (query, value, succEvent) {
  
    this._pool.getConnection(function (err, connection) {
        connection.query(query, value, function (err, rows) {
            if (err) {
                connection.release();
                throw err;
            }

            succEvent(rows);
            connection.release();
        });
    });
};

module.exports = DBService;
