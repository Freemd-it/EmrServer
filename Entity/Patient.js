/**
 * Created by (byung sin = donghyun) on 2017. 7. 20..
 */
var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Patient = dbService.define('patient', {

    firstVisit : { type : sequelize.DATE, allowNull : false },
    name : { type : sequelize.STRING(40), allowNull : false },
    gender : { type : sequelize.ENUM('male', 'female'), allowNull : true },
    marital : { type : sequelize.ENUM('Y', 'N'), allowNull : true },
    birth : { type : sequelize.CHAR(10), allowNull : true },
    height : { type : sequelize.INTEGER(3), allowNull : true },
    weight : { type : sequelize.INTEGER(2), allowNull : true },
    BMI : { type : sequelize.STRING(10), allowNull : true },
    smokingAmount : { type : sequelize.STRING(3), allowNull : true },
    smokingPeriod : { type : sequelize.CHAR(2), allowNull : true },
    drinkingAmount : { type : sequelize.STRING(3), allowNull : true },
    drinkingWeekly : { type : sequelize.STRING(3), allowNull : true }
});

module.exports = Patient;
