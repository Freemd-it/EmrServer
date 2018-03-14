/**
 * Created by donghyun on 2017. 7. 20..
 */
var express = require('express');
var bodyParser = require('body-parser');

var sequelize = require('../Service/SequelizeService.js');

var receiptModel = require('../Model/ReceiptModel.js');
const waitingModel = require('../Model/WaitingModel.js');
const chartModel = require('../Model/ChartModel.js');
const { respondHtml, respondJson, respondOnError } = require('../Utils/respond');

var router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Receipt] ReceiptController started ##');
    next();
});

router.get('/', (req, res, next) => {
    respondHtml(res, 'receipt');
})

router.get('/patients',function (req, res) {
    const name = req.query.name;
    receiptModel.FindAll(name, result => {
        res.send(result);
    });
});

router.get('/patient', function (req, res){
    receiptModel.Find (req.query.id, result => {
        res.send(result);
    });
});

router.post('/patient', function (req, res){

    let waitingInsertBirth = req.body.birth;

    receiptModel.UpdateOrCreate (req.body, result => {
        if(result.sqlStatus === 200) {

            chartModel.create(result.dataValues, chartResult => {
                chartResult.birth = waitingInsertBirth;
                waitingModel.Insert(chartResult , result => {
                    res.send(result);
                });
            });
        }else{

          console.log(result);
        }
    });
});

module.exports = router;
