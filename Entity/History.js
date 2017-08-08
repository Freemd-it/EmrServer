/**
 * Created by donghyun on 2017. 7. 24..
 */

 var sequelize = require('sequelize');
 var dbService = require('../Service/SequelizeService.js');

const History = dbService.define('history', {

  pastHistory : { type : sequelize.STRING(60) , allowNull : true },
  pastHistoryComment : { type : sequelize.STRING(255), allowNull : true },
  allergy : { type : sequelize.STRING(30) , allowNull : true },
  allergyComment : { type : sequelize.STRING(255), allowNull : true },
  pastMedical : { type : sequelize.ENUM('Y', 'N'), allowNull : true },
  pastMedicalTime : { type : sequelize.STRING(255), allowNull : true },
  pastMedicalArea : { type : sequelize.STRING(255), allowNull : true },
  pastMedication : { type : sequelize.ENUM('Y', 'N'), allowNull : true },
  pastMedicationType : { type : sequelize.STRING(255), allowNull : true },
  pastMedicationPeriod : { type : sequelize.STRING(255), allowNull : true }
});

 module.exports = History;
