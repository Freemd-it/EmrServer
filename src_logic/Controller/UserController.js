var uuid = require('node-uuid');
var crypto = require("crypto");
var jwt = require('jwt-simple'); // Json Web Token 방식 사용할까
var moment = require('moment');

var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var util = require('util');

var sequelize = require('../Service/SequelizeService.js');
var userModel = require('../Model/UserModel.js');

var router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [TEST] UserController started ##');
    next();
});

router.get('/list', function(req, res, callback){

    console.log(req.body);
    userModel.List(result => {

        res.status(200).json(result);
    });
});

router.post('/update', function(req, res, callback){

    console.log(req.body);
    userModel.Update(result => {

        res.status(200).json(result[0]);
    });
});

router.post('/insert', function(req, res, callback){

    console.log(req.body);
    userModel.Insert(result => {

        res.status(200).json(result);
    });
});

router.post('/delete', function(req, res, callback){

    console.log(req.body);
    userModel.Delete(result => {

        res.status(200).json(result);
    });
});

router.post('/table', function(req, res, callback){

    console.log(req.body);
    userModel.CreateTable(result => {

        res.status(200).json(result);
    });
});

module.exports = router;
