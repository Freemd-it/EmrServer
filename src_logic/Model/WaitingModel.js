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
      attributes: ['chart_id', 'name', 'birth', 'status'],
    })
    .then(result => {
      // console.log(result);
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

WaitingModel.FindAll = function(callback) {

  waiting.findAll({
      attributes: ['chart_id', 'name', 'birth', 'status'],
    })
    .then(result => {
      // console.log(result);
      callback(result);
    })
    .catch(error => {
      // console.log(result);
      callback(error);
    });
}

WaitingModel.Update = function(data, callback) {

  waiting.update({
    status: data.status
  }, {
    where: {
      chart_id: data.chart_id
    }
  }).then(results => {
    callback(results);
  });
}

/* Create */
WaitingModel.Insert = function(data, callback) {
  waiting.create({
      chart_id: data.dataValues.chartNumber,
      name: data.name,
      birth: data.birth
    }).then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

module.exports = WaitingModel;
