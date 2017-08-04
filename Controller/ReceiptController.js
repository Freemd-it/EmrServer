/**
 * Created by donghyun on 2017. 7. 20..
 */
var express = require('express');
var bodyParser = require('body-parser');

var sequelize = require('../Service/SequelizeService.js');

var receiptModel = require('../Model/ReceiptModel.js');


var router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Receipt] ReceiptController started ##');
    next();
});

router.get('/patients',function (req, res) {
    const name = req.query.name;
    receiptModel.FindAll(name, result => {
        res.send(result);
    });
});

router.get('/patient', function (req, res){
    receiptModel.Find (req.query.id, result => {
        //console.log(result);
        res.send(result);
    });
});

router.post('/patient', function (req, res){

    req.body.BMI = String((Number(req.body.weight) / (Number(req.body.height / 100) * Number(req.body.height / 100))).toFixed(1));

    receiptModel.Insert (req.body, result => {
        res.send(result);
    });
});

module.exports = router;
