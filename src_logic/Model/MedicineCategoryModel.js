var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var category = require('../Entity/MedicineCategory.js');

var MedicineCategoryModel = function(data){
    this.data = data;
}

MedicineCategoryModel.ListMain = function(callback){

    category.findAll({
      distinct: 'primaryCategory'
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

MedicineCategoryModel.ListSmall = function(data, callback){

    category.findAll({
      where: {
        primaryCategory: data.primaryCategory
      }
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

// MedicineCategoryModel.getPastChart = function (data, callback) {
//     const chartDate = new Date().toISOString().slice(0,10).replace(/-/g,"");
//
//     chart.find({
//         where : {
//             chartNumber : data.chartId,
//         },
//     }).then(result => {
//         console.log(result.dataValues.patient_id);
//
//         chart.findAll({
//             where : {
//                 patient_id : result.dataValues.patient_id,
//                 $and: { chartNumber : {
//                     $lt : chartDate + '00',
//                 }}
//             },
//             limit : 10,
//             order : [['chartNumber', 'DESC']],
//         }).then(result => {
//             callback(result);
//         });
//     });
// }

module.exports = MedicineCategoryModel;
