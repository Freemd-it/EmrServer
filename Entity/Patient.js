/**
 * Created by donghyun on 2017. 7. 20..
 */
var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Patient = dbService.define('patients', {
    id: { type: sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name : { type : sequelize.STRING, allowNull : false },
    gender : { type : sequelize.ENUM('male', 'female'), allowNull : false },
    birth : { type : sequelize.DATE, allowNull : false },
    height : { type : sequelize.INTEGER, allowNull : false },
    weight : { type : sequelize.INTEGER, allowNull : false}/*,
    smoke : { type : sequelize.STRING, allowNull : false },
    alcohol : { type : sequelize.STRING, allowNull : false }*/
});

module.exports = Patient;