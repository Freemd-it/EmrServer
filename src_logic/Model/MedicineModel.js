var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var user = require('../Entity/Medicine.js');

var MedicineModel = function(data){
    this.data = data;
}

/* Read */
MedicineModel.List = function(callback){

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


module.exports = MedicineModel;
