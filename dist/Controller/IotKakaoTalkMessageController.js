'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var util = require('util');

var friendTalkModel = require('../Model/FriendTalkModel.js');

var router = express.Router();

router.use(function log(req, res, next) {
    console.log('## [IOT] kakaoTalkMessageController started ##');
    next();
});

router.post('/door', function (req, res) {

    console.log(req.body);

    var stamp = "DOOR";
    //var jsonString = JSON.parse(req.body);
    var jsonString = req.body;

    var deviceFlagValue = jsonString['m2m:sgn'].nev.rep['m2m:cin'].con;
    friendTalkModel.IotSendMessage(deviceFlagValue, stamp, function (result) {

        console.log(util.format("## MESSAGE SEND RESUT CODE >> %s ##", result.code));
        res.json({
            code: result.code,
            cmid: result.cmid,
            message: result.message
        });
        res.end();
    });
});

router.post('/light', function (req, res) {

    console.log(req.body);

    var stamp = "LIGHT";
    //var jsonString = JSON.parse(req.body);
    var jsonString = req.body;

    var deviceFlagValue = jsonString['m2m:sgn'].nev.rep['m2m:cin'].con;
    friendTalkModel.IotSendMessage(deviceFlagValue, stamp, function (result) {

        console.log(util.format("## MESSAGE SEND RESUT CODE >> %s ##", result.code));
        res.json({
            code: result.code,
            cmid: result.cmid,
            message: result.message
        });
        res.end();
    });
});

router.post('/dust', function (req, res) {

    console.log(req.body);

    var stamp = "DUST";
    //var jsonString = JSON.parse(req.body);
    var jsonString = req.body;

    var deviceFlagValue = jsonString['m2m:sgn'].nev.rep['m2m:cin'].con;
    friendTalkModel.IotSendMessage(deviceFlagValue, stamp, function (result) {

        console.log(util.format("## MESSAGE SEND RESUT CODE >> %s ##", result.code));
        res.json({
            code: result.code,
            cmid: result.cmid,
            message: result.message
        });
        res.end();
    });
});

router.post('/gas', function (req, res) {

    console.log(req.body);

    var stamp = "GAS";
    //var jsonString = JSON.parse(req.body);
    var jsonString = req.body;

    var deviceFlagValue = jsonString['m2m:sgn'].nev.rep['m2m:cin'].con;
    friendTalkModel.IotSendMessage(deviceFlagValue, stamp, function (result) {

        console.log(util.format("## MESSAGE SEND RESUT CODE >> %s ##", result.code));
        res.json({
            code: result.code,
            cmid: result.cmid,
            message: result.message
        });
        res.end();
    });
});

module.exports = router;
//# sourceMappingURL=IotKakaoTalkMessageController.js.map