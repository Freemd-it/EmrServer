var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const User = dbService.define('user', {

    account : { type : sequelize.STRING(255), allowNull : false },
    password : { type : sequelize.STRING(300), allowNull : false },
    permission : { type : sequelize.CHAR(4), allowNull : false },
    description : { type : sequelize.STRING(150), allowNull : true },
});

module.exports = User;
