var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const OCS = dbService.define('oc', {

    chart_id : { type : sequelize.INTEGER(11), allowNull : false},
    chartNumber : { type : sequelize.INTEGER(11), allowNull : false},
    name : { type : sequelize.STRING(40), allowNull : false },
    gender : { type : sequelize.ENUM('male', 'female'), allowNull : false },
    birth : { type : sequelize.CHAR(10), allowNull : false },
    status : { type : sequelize.INTEGER(1), allowNull : true, defaultValue : 1}
});

module.exports = OCS;
