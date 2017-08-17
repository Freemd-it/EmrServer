// const sequelize = require('sequelize');
// const dbService = require('../Service/SequelizeService.js');
const waiting = require('../Entity/Waiting.js');

const WaitingModel = function(data){
    this.data = data;
}

/* Create */
WaitingModel.Insert = function(data, callback){

    waiting.create({
        chart_id : data.dataValues.chartNumber,
        name : data.name,
    }).then(result => {
            callback(result);
    })
        .catch(error => {
            callback(error);
        });
}

module.exports = WaitingModel;
