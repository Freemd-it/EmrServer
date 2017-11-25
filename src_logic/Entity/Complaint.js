var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Complaint = dbService.define('complaint', {

    chiefComplaint : { type : sequelize.STRING(255), allowNull : true},
    chiefComplaintHistory : { type : sequelize.STRING(500), allowNull : true},
});

module.exports = Complaint;
