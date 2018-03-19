var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Prescription = dbService.define('prescription', {

  medicine_id : { type : sequelize.INTEGER(11), allowNull : false},
  chartNumber	: { type :	sequelize.INTEGER(12), allowNull : false },
  medicineName : { type : sequelize.STRING(40), allowNull : false },
  medicineIngredient : { type : sequelize.STRING(100), allowNull : false },
  doses : { type : sequelize.INTEGER(5), allowNull : true },
  dosesCountByDay : { type : sequelize.CHAR(3), allowNull : true },
  dosesDay : { type : sequelize.INTEGER(5), allowNull : true },
  useTotal : { type : sequelize.INTEGER(5), allowNull : false },
  useFlag : { type : sequelize.BOOLEAN, allowNull : false, defaultValue : 0 },
  remarks : { type : sequelize.STRING(100), allowNull : true }
});

module.exports = Prescription;
