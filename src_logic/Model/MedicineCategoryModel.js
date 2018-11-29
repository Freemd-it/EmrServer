var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var medicine = require('../Entity/Medicine')

var MedicineCategoryModel = function(data){
    this.data = data;
}

MedicineCategoryModel.listMain = function(callback){

    medicine.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('primaryCategory')) ,'primaryCategory']]
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

MedicineCategoryModel.listSmall = function(data, callback){

    medicine.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('secondaryCategory')), 'secondaryCategory']],
      where: {
        primaryCategory: data.primaryCategory,
      }
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

module.exports = MedicineCategoryModel;
