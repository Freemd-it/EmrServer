var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Prescription = dbService.define('prescription', {

  medicine_id : { type : sequelize.INTEGER(11), allowNull : false},
  chartNumber	: { type :	sequelize.INTEGER(12), allowNull : false },
  medicineName : { type : sequelize.STRING(40), allowNull : false },
  medicineIngredient : { type : sequelize.STRING(100), allowNull : false },
  doses : { type : sequelize.INTEGER(5), allowNull : true },
  dosesCountByDay : { type : sequelize.INTEGER(5), allowNull : true },
  dosesDay : { type : sequelize.INTEGER(5), allowNull : true },
  remarks : { type : sequelize.STRING(100), allowNull : true }
});

module.exports = Prescription;
