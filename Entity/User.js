var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const User = dbService.define('user', {

    account : { type : sequelize.STRING(255), allowNull : false},
    password : { type : sequelize.STRING(255), allowNull : false},
    oridinal : { type : sequelize.CHAR(5), allowNull : true},
    name : { type : sequelize.STRING(50), allowNull : true},
    phone : { type : sequelize.CHAR(13), allowNull : true},
    mail : { type : sequelize.STRING(70), allowNull : true}
});

module.exports = User;
