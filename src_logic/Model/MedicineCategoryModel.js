var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var category = require('../Entity/MedicineCategory.js');

var MedicineCategoryModel = function(data){
    this.data = data;
}

MedicineCategoryModel.listMain = function(callback){

    category.findAll({
      attributes: [sequelize.fn('DISTINCT', sequelize.col('primaryCategory')) ,'primaryCategory']
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

MedicineCategoryModel.listSmall = function(data, callback){

    category.findAll({
      attributes: ['secondaryCategory'],
      where: {
        primaryCategory: data.primaryCategory,
      }
    })
    .then(result => {
        //console.log('약품 결과는 어디서 가져오니', result)
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

module.exports = MedicineCategoryModel;
