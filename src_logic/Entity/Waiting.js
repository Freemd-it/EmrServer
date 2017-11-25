var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Waiting = dbService.define('waiting', {

    chart_id : { type : sequelize.INTEGER(11), allowNull : false},
    name : { type : sequelize.STRING(40), allowNull : false},
    birth : { type : sequelize.CHAR(10), allowNull : true},
    status : { type : sequelize.INTEGER(1), allowNull : true, defaultValue : 1}
});

module.exports = Waiting;
