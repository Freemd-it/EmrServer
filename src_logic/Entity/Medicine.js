var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

const Medicine = dbService.define('medicine', {

    name : { type : sequelize.STRING(40), allowNull : false },
    primaryCategory : { type : sequelize.STRING(100), allowNull : false },
    secondaryCategory : { type : sequelize.STRING(100), allowNull : false },
    medication : { type : sequelize.STRING(255), allowNull : true },
    property : { type : sequelize.STRING(255), allowNull : true },
    ingredient : { type : sequelize.STRING(100), allowNull : false },
    amount : { type : sequelize.INTEGER(3), allowNull : false },
    quantity : { type : sequelize.INTEGER(3), allowNull : false },
    available : { type : sequelize.TINYINT(1), allowNull : false, defaultValue : 1 },
    totalAmount : { type : sequelize.INTEGER(6), allowNull : false },
    expiry : { type: sequelize.DATE, allowNull : true },
    memo : { type: sequelize.STRING(300), allowNull : true }
},
{
    indexes : [
      {
          unique : false,
          fields : [ 'primaryCategory', 'secondaryCategory' ]
      }
    ]
});

module.exports = Medicine;
