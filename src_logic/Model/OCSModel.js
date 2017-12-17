const sequelize = require('sequelize');
const dbService = require('../Service/SequelizeService.js');
const ocs = require('../Entity/OCS.js');

var OCSModel = function (data) {
  this.data = data;
}

OCSModel.receipt = function (patient, chart, callback) {
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

OCSModel.preDiagonosis = function (data, callback) {
  ocs.update({
    status: 2
  }, {
      where: { chartNumber: data }
    }).then(callback)
}

OCSModel.originalDiagnosis = function (data, callback) {
  ocs.update({
    status: 3
  }, {
      where: { chartNumber: data }
    }).then(callback)
}

OCSModel.prescription = function (data, callback) {

}

OCSModel.find = async function (options) {

  const { attributes = [], where = {}, limit = 1, order = [] } = options;
  if (limit) {
    return await ocs.findAll({
      attributes: attributes,
      where: where,
      order: order,
      limit: limit
    })
  } else {
    return await ocs.findOne({
      where: where,
      order: order
    })
  }

}

OCSModel.findAll = async function (options) {

  const { where = {}, order = [] } = options;

  return ocs.findAll({
    where: where,
    include: include,
    order: order
  })
};

OCSModel.count = async function () {
  return ocs.count();
}

module.exports = OCSModel;
