const sequelize = require('sequelize');
const dbService = require('../Service/SequelizeService.js');
const Patient = require('./Patient');

const Chart = dbService.define('chart', {

    chartNumber: { type: sequelize.INTEGER(12), allowNull: false, unique: 'chartNumber' },
    status: { type: sequelize.INTEGER(1), allowNull: true },
    SpO2: { type: sequelize.INTEGER(3), allowNull: true },
    heartRate: { type: sequelize.INTEGER(3), allowNull: true },
    bodyTemporature: { type: sequelize.INTEGER(3), allowNull: true },
    systoleBloodPressure: { type: sequelize.INTEGER(3), allowNull: true },
    diastoleBloodPressure: { type: sequelize.INTEGER(3), allowNull: true },
    bloodGlucose: { type: sequelize.INTEGER(3), allowNull: true },
    mealTerm: { type: sequelize.INTEGER(3), allowNull: true },
    impression: { type: sequelize.STRING(300), allowNull: true },
    presentIllness: { type: sequelize.STRING(300), allowNull: true },
    treatmentNote: { type: sequelize.STRING(300), allowNull: true },
});

module.exports = Chart;
