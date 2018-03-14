const complaint = require('../Entity/Complaint.js');
const chart = require('../Entity/Chart.js');

const _ = require('lodash');

var ComplaintModel = function(data){
    this.data = data;
}


/* Create */
ComplaintModel.Insert = function(data, callback){
    let CCmodels = [];
    const ccArray = JSON.parse(data.ccArray);
    // console.log(ccArray);

    ccArray.forEach(objectData => {
       if( _.startsWith(objectData.name, 'CC')) {
           CCmodels.push(_.assign({'chiefComplaint' : objectData.value }));
       }

       if(_.startsWith(objectData.name, 'History')) {
           _.assign(_.last(CCmodels), {'chiefComplaintHistory' : objectData.value })
       }
    });

    chart.find({
        where : {
            chartNumber : data.chartNumber,
        },
    }).then(result => {
        _.forEach(CCmodels, (object) => {
            complaint.create(_.assign(object, {'chart_id' : result.dataValues.id, 'patient_id': result.dataValues.patient_id}));
        });
    }).then(result => {
      callback(1)
    }).catch(error => {
      callback(0)
    })
}

ComplaintModel.findAllByChartId = function(data, callback){

    let CCmodels = [];

    complaint.findAll({
      where : {
          chart_id : data,
      },
    }).then(result => {
      callback(result)
    })
}

module.exports = ComplaintModel;
