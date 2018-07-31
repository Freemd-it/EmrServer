const express = require('express');

const categoryModel = require('../Model/MedicineCategoryModel.js');
const { respondHtml } = require('../Utils/respond');
const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Chart] ChartController started ##');
    next();
});

router.get('/', function (req, res, next) {
    respondHtml(res, 'pharmacy', { auth : req.session.auth });
})

router.post('/update', function (req, res) {

    const data = {
        status: 2,
        chart_id: req.body.chartNumber,
    };

    chartModel.updateChartByChartNumber(req.body, result => {
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
