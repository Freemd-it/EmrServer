var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var util = require('util');

var common = require('../Common/Common.js');

var router = express.Router();

router.use(function log(req, res, next) {
    console.log('## [AUTH] AuthController started ##');
    next();
});

router.post('/login', function(req, res){

    // console.log(req.body);
    var text = common.Encryption(req.body.password, 'aes-256-ctr');
    console.log("-------암호화-------");
    console.log(text);
    console.log("-------복호화-------");
    console.log(common.Decryption(text, 'aes-256-ctr'));
    console.log("-------해싱-------");
    console.log(common.Hashing(req.body.password, 'ripemd160WithRSA'));

    res.status(200).json(req.body);
});

module.exports = router;
