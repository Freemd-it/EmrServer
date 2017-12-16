var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var medicine = require('../Entity/Medicine.js');

var MedicineModel = function(data){
    this.data = data;
}

/* Read */
MedicineModel.list = function(data, callback){

    medicine.findAll({
      attributes: [
        'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient'
      ]
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

MedicineModel.search = function(data, callback){

    if (data.option === '1') {
      medicine.findAll({
        attributes: [
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient'
        ],
        where: {
          name: { like: '%'+data.searchText+'%' }
        }
      })
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
    } else {
      medicine.findAll({
        attributes: [
          'id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient'
        ],
        where: {
          ingredient: { like: '%'+data.searchText+'%' }
        }
      })
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
    }
}


module.exports = MedicineModel;
