const express = require('express');

const chartModel = require('../Model/ChartModel.js');
const waitingModel = require('../Model/WaitingModel.js');

const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Chart] ChartController started ##');
    next();
});

router.get('/', function (req, res){

    chartModel.getChartByChartNumber (req.query, result => {
        //console.log(result);
        res.send(result);
    });
});

router.post('/update', function (req, res) {

    const data = {
        status : req.body.updateStatus,
        chart_id : req.body.chartNumber,
    };

    chartModel.updateChartByChartNumber (req.body, result => {
        waitingModel.Update(data, result => {
            res.send(result);
        });
    })
});

router.get('/pastAll', function (req, res) {

    chartModel.getPastChart(req.query, result => {
        res.send(result)
    });

});

router.get('/pastOne', function (req, res) {

    chartModel.getOnePastChart(req.query, result => {
        res.send(result);
    });

});

module.exports = router;
