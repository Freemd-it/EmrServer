const chart = require('../Entity/Chart.js');

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

module.exports = ChartModel;
