var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Chart = dbService.define('CHART', {

    chartNo : { type : sequelize.String(12), allowNull : false}
});

module.exports = User;
