var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

var ChartModel = function(data){
    this.data = data;
}



module.exports = ChartModel;
