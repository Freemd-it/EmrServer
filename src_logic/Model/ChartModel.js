const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaintEntity = require('../Entity/Complaint.js');

const complaint = require('./ComplaintModel');
const ocs = require('./OCSModel');
const prescription = require('./PrescriptionModel');

var ChartModel = function (data) {
    this.data = data;
}

ChartModel.create = function (data, callback) {
    const chartDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    chart.findAll({
        where: {
            chartNumber: {
                $gt: chartDate + '00',
            }
        }
    }).then(results => {
        const num = results.length > 8 ? results.length + 1 : '0' + (results.length + 1);
        chart.create({
            patient_id: data.id,
            chartNumber: chartDate + num,
        }).then(result => {
            result['name'] = data.name;
            ocs.receipt(data, result, ocsResult => {
              callback(result)
            })
        })
    });

}

ChartModel.getChartByChartNumber = function (data, callback) {

    chart.find({
        where: {
            chartNumber: data.chartNumber
        },
        include: [
            {
                model: patient
            }
        ]
    }).then(result => {

        const chartInfo = result

        if (data.complaintsKey) {
            return new Promise(function GETComplaints(resolve, reject) {
                complaint.findAllByChartId(result.id, result => {
                    chartInfo.dataValues.complaints = result
                    callback(chartInfo)
                })
            })
        } else {
            callback(chartInfo)
        }
    })
}

ChartModel.updateChartByChartNumber = function (data, callback) {

    if (data.updateStatus === '2') {
        chart.update({
            status: 2,
            heartRate: data.heartRate ? data.heartRate : 0,
            heartRate: data.heartRate ? data.heartRate : 0,
            pulseRate: data.pulseRate ? data.pulseRate : 0,
            bodyTemporature: data.bodyTemporature ? data.bodyTemporature : 0,
            systoleBloodPressure: data.systoleBloodPressure ? data.systoleBloodPressure : 0,
            diastoleBloodPressure: data.diastoleBloodPressure ? data.diastoleBloodPressure : 0,
            bloodGlucose: data.bloodGlucose ? data.bloodGlucose : 0,
            mealTerm: data.mealTerm ? data.mealTerm : 0,
        }, {
                where: {
                    chartNumber: data.chartNumber
                }
            }).then(results => {

                complaint.Insert(data, result => {
                  if (result === 1) {
                    ocs.preDiagonosis(data.chartNumber, callback)
                  }
                })
            })
    }
    else if (data.updateStatus === '3') {
        let medicines = JSON.parse(data.prescription);
        chart.update({
            status: 3,
            impression: data.impression,
            presentIllness: data.presentIllness,
            treatmentNote: data.treatmentNote,
        }, {
                where: {
                    chartNumber: data.chartNumber
                }
            }).then(result => {
                prescription.createAll(data, result => {
                  ocs.originalDiagnosis(data.chartNumber, callback)
                });
            })
    }
}

ChartModel.getPastChart = function (data, callback) {
    const chartDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");


    const chartFindAll = (result) => {

        return chart.findAll({
            where: {
                patient_id: result.dataValues.patient_id,
                $and: {
                    chartNumber: {
                        $lt: chartDate + '00',
                    }
                }
            },
            limit: 10,
            order: [['chartNumber', 'DESC']],
        });

    }

    chart.find({
        where: {
            chartNumber: data.chartId,
        },
    })
        .then(chartFindAll)
        .then(result => callback(result))

}

ChartModel.getOnePastChart = function (data, callback) {

    chart.find({
        where: {
            chartNumber: data.chartNumber,
        },
        include: {
            model: complaintEntity,
        }
    }).then(result => callback(result));

}


ChartModel.find = async function (options) {

    const { where = {}, include = {}, limit = 1, order = [] } = options;

    if (limit) {
        return await chart.findAll({
            where: where,
            include: include,
            order: order,
            limit: limit
        })
    } else {
        return await chart.findOne({
            where: where,
            include: include,
            order: order
        })
    }

}

ChartModel.findAll = async function (options) {

    const { where = {}, include = {}, order = [] } = options;

    return chart.findAll({
        where: where,
        include: include,
        order: order
    })
}

module.exports = ChartModel;
