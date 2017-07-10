var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const User = dbService.define('user', {

    account : { type : sequelize.STRING(50), allowNull : false},
    password : { type : sequelize.STRING, allowNull : false}
});

module.exports = User;
