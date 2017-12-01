var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var user = require('../Entity/MedicineCategory.js');

var medicineCategoryModel = function(data){
    this.data = data;
}

medicineCategoryModel.List = function(callback){

    user.findAll({
        where : {
          $and : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}]
        },
        limit : 2,
        raw : true
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

module.exports = medicineCategoryModel;
