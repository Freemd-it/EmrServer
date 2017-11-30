const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaintEntity = require('../Entity/Complaint.js');

const complaint = require('./ComplaintModel');

var ChartModel = function (data) {
    this.data = data;
}

ChartModel.create = function (data, callback) {
    const chartDate = new Date().toISOString().slice(0,10).replace(/-/g,"");

    chart.findAll({
        where : {
            chartNumber : {
                $gt : chartDate + '00',
            }
        }
    }).then(results => {
        const num = results.length > 8 ? results.length + 1 : '0' + (results.length + 1);
        chart.create({
            patient_id: data.id,
            chartNumber: chartDate+num,
        }).then(result => {
            result['name'] = data.name;
            callback(result);
        })
    });

}

ChartModel.getChartByChartNumber = function (data, callback) {

    chart.find({
        where : {
            chartNumber : data.chartNumber
        },
        include: {
            model: patient,
        }
    }).then(result => {
        callback(result);
    })
}

ChartModel.updateChartByChartNumber = function (data, callback) {

    chart.update({
        heartRate : data.heartRate ? data.heartRate : 0,
        heartRate : data.heartRate ? data.heartRate : 0,
        pulseRate : data.pulseRate ? data.pulseRate : 0,
        bodyTemporature : data.bodyTemporature ? data.bodyTemporature : 0,
        systoleBloodPressure : data.systoleBloodPressure ? data.systoleBloodPressure : 0,
        diastoleBloodPressure : data.diastoleBloodPressure ? data.diastoleBloodPressure : 0,
        bloodGlucose : data.bloodGlucose ? data.bloodGlucose : 0,
        mealTerm: data.mealTerm ? data.mealTerm : 0,
    }, {
        where : {
                chartNumber : data.chartNumber
        }
    }).then(results => {

        complaint.Insert(data, callback)
    })
}

ChartModel.getPastChart = function (data, callback) {
    const chartDate = new Date().toISOString().slice(0,10).replace(/-/g,"");

    chart.find({
        where : {
            chartNumber : data.chartId,
        },
    }).then(result => {
        console.log(result.dataValues.patient_id);

        chart.findAll({
            where : {
                patient_id : result.dataValues.patient_id,
                $and: { chartNumber : {
                    $lt : chartDate + '00',
                }}
            },
            limit : 10,
            order : [['chartNumber', 'DESC']],
        }).then(result => {
            callback(result);
        });
    });

}

ChartModel.getOnePastChart = function (data, callback) {

    chart.find({
        where : {
            chartNumber : data.chartNumber,
        },
        include: {
            model: complaintEntity,
        }
    }).then(result => {

        callback(result);
    });

}

module.exports = ChartModel;