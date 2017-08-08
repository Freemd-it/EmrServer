var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Permission = dbService.define('permission', {

    code : { type : sequelize.INTEGER(11), allowNull : false, defaultValue : 7777 },
    description : { type : sequelize.CHAR(30), allowNull : false, defaultValue : "의사선생님" }
});

module.exports = Permission;
