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
ReceiptModel.FindAll = function(name, callback){
    patient.findAll({
        where: {
            name,
        },
        attributes: ['id', 'name', 'bmi', 'birth', 'height', 'weight', 'createdAt', 'gender', 'drinkingAmount', 'smokingAmount', 'smokingPeriod', 'drinkingPeriod']
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
            id
        },
        attributes: ['id', 'name', 'bmi', 'birth', 'height', 'weight', 'createdAt', 'gender', 'drinkingAmount', 'smokingAmount', 'smokingPeriod', 'drinkingPeriod']
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
