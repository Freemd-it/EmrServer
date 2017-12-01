var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const medicineCategory = dbService.define('medicineCategory', {

    primaryCategory : { type : sequelize.STRING(100), allowNull : true},
    secondaryCategory : { type : sequelize.STRING(100), allowNull : true},
});

module.exports = medicineCategory;
