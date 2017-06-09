var uuid = require('node-uuid');
var crypto = require("crypto");
var jwt = require('jwt-simple'); // Json Web Token 방식 사용할까
var moment = require('moment');

var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var util = require('util');

var router = express.Router();

router.use(function log(req, res, next) {
    console.log('## [SESSION] SessionController started ##');
    next();
});

router.post('/login', function(req, res){

    console.log(req.body);
});

module.exports = router;
