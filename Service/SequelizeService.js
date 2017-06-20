var Sequelize = require("sequelize");
var config = require('../Common/Config.js');

var sequelize = new Sequelize(config.storeConfig.mysqlDatabase,
                         config.storeConfig.mysqlUser,
                         config.storeConfig.mysqlPassword, {
    host : config.storeConfig.mysqlHost,
    dialect : config.storeConfig.storeDBMS,
    port : config.storeConfig.mysqlPort,
    pool : {
      max : config.storeConfig.ConnectionLimit,
      min : config.storeConfig.ConnectionMinimum,
      idle : config.storeConfig.ConnectionIdle,
      waitForConnections : false /* 사용 가능한 커넥션이 없을 경우 바로 ERROR를 return | true일 경우 대기 */
    },
});

module.exports = sequelize;
