const waiting = require('../Entity/Waiting.js');

const WaitingModel = function(data) {
  this.data = data;
}

/* Find */
WaitingModel.FindByStatus = function(status, callback) {

  waiting.findAll({
      where: {
        status,
      },
      attributes: ['chartNumber', 'name', 'birth', 'status'],
      order: [
        ['chartNumber', 'ASC']
      ]
    })
    .then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

WaitingModel.FindByPharmacy = async function (options) {

  const { limit, attributes, where, order } = options;
  return await waiting.findAll(options);
}

WaitingModel.FindAll = function(callback) {

  waiting.findAll({
      attributes: ['chartNumber', 'name', 'birth', 'status'],
    })
    .then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

WaitingModel.Update = function(data, callback) {

  waiting.update({
    status: data.status
  }, {
    where: {
      chartNumber: data.chart_id
    }
  }).then(results => {
    callback(results);
  });
}

/* Create */
WaitingModel.Insert = function(data, callback) {
  waiting.create({
      chartNumber: data.dataValues.chartNumber,
      name: data.name,
      birth: data.birth,
      status: 1
    }).then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

WaitingModel.Count = async function () {
  return waiting.count();
}

module.exports = WaitingModel;
