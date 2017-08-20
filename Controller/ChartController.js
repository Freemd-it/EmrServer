const express = require('express');

const chartModel = require('../Model/ChartModel.js');

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

module.exports = router;
