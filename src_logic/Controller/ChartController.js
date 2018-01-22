
/**
 * Defendencies
 */
const express = require('express');
const chartModel = require('../Model/ChartModel.js');
const waitingModel = require('../Model/WaitingModel.js');
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError } = require('../Utils/respond');


/**
 * Entity
 */
const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaintEntity = require('../Entity/Complaint.js');



const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Chart] ChartController started ##');
    next();
});

router.get('/', function (req, res) {

    chartModel.getChartByChartNumber(req.query, result => {
        //console.log(result);
        res.send(result);
    });
});

router.post('/update', function (req, res) {

    const data = {
        status: req.body.updateStatus,
        chart_id: req.body.chartNumber,
    };

    chartModel.updateChartByChartNumber(req.body, result => {
        waitingModel.Update(data, result => {
            console.log(result)
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

/**
 * patient id를 통해 vital sign json 데이터 가져오기
 */
router.get('/vitalSign/:patient_id', function (req, res, next) {
    const { patient_id } = req.params;
    //TODO middleware로 권한체크해야함.

    //condition
    const options = {};
    options.where = { patient_id: patient_id }
    options.include = { model: patient }
    options.limit = 10
    options.order = [['createdAt', 'DESC']]


    chartModel
        .find(options)
        .then(result => respondJson(res, resultCode.success, result))
        .catch((error) => respondOnError(res, resultCode.fail, error))

});

module.exports = router;
