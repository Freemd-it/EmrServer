const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');

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

module.exports = ChartModel;
