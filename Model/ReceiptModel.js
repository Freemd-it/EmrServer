/**
 * Created by donghyun on 2017. 7. 20..
 */


var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var patient = require('../Entity/Patient.js');

var ReceiptModel = function(data){
    this.data = data;
}



/* Read */
ReceiptModel.FindAll = function(callback){
    patient.findAll({
        attributes: ['id', 'name', 'birth']
    })
        .then(result => {
            callback(result);
        })
        .catch(error => {
            callback(error);
        });
}

ReceiptModel.Find = function(id, callback){
    patient.find({
        where : {
            id : id
        }
    })
        .then(result => {
            callback(result);
        })
        .catch(error => {
            callback(error);
        });
}

ReceiptModel.Insert = function (data, callback){
    patient.create({
        name : data.name,
        gender : data.gender,
        birth : data.birth,
        height : data.height,
        weight : data.weight
    })
        .then(result => {
            callback(result);
        })
        .catch(error => {
            callback(error);
        });
}


module.exports = ReceiptModel;
