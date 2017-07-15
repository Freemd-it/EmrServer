var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Chart = dbService.define('chart', {

    chartNo : { type : sequelize.STRING(12), allowNull : false}
});

module.exports = Chart;
