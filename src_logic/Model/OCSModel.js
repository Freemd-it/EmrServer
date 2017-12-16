var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var ocs = require('../Entity/OCS.js');

var OCSModel = function(data){
    this.data = data;
}

OCSModel.receipt = function(patient, chart, callback) {
  ocs.create({
    chart_id: chart.id,
    chartNumber: chart.chartNumber,
    name: patient.name,
    gender: patient.gender,
    birth: patient.birth
  }).then(result => {
    callback(result.id)
  }).catch(error => {
    callback(error)
  })
}

OCSModel.preDiagonosis = function(data, callback) {
  ocs.update({
    status: 2
  }, {
    where: { chartNumber: data }
  }).then(callback)
}

OCSModel.originalDiagnosis = function(data, callback) {
  ocs.update({
    status: 3
  }, {
    where: { chartNumber: data }
  }).then(callback)
}

OCSModel.rrescription = function(data, callback) {

}

module.exports = OCSModel;
