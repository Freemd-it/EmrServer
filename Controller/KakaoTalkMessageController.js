/**

async waterfall을 통해 태스크 간 argument 전달을 수행하며
메서드 체이닝을 수행
(receive > insert > select1 (발송 확인) > select2(대체 발송이 되었을 경우 확인) > response)

*/
var express = require('express');
var bodyParser = require('body-parser');
var async = require("async");
var util = require('util');

var alimTalkModel = require('../Model/AlimTalkModel.js');

var router = express.Router();

var AlimTalkWaterfall = function(){};

router.use(function log(req, res, next) {
    console.log('## kakaoTalkMessageController started ##');
    next();
});

router.post('/alimtalk', function(req, res){

    var insertValue = req.body;

    async.waterfall([
      AlimTalkWaterfall.Send = function(callback){
          alimTalkModel.SendMessage(insertValue, function(result, error){

                if(error) throw error;
                callback(0, result);
          });
      },
      AlimTalkWaterfall.SendCheck = function(result, callback){
          alimTalkModel.SendResultCheck(result, function(result, error){

                setTimeout(function(){
                    if(result.CALL_STATUS === "9"){

                        return AlimTalkWaterfall.SendCheck(result.CMID, callback);
                    }
                    else{

                        callback(0, result);
                    }
                }, 3000);
           });
      },
      AlimTalkWaterfall.ReSendCheck = function(result, callback){

          console.log("## ReSendCheck STARTED ##");
          console.log(result);
          console.log("## ReSendCheck END ##");

          if(result.CALL_STATUS !== "1000" && insertValue.reSendType !== undefined){

                setTimeout(function(){
                    alimTalkModel.ReSendResultCheck(result.CMID, function(result, error){

                        console.log(result);

                        if(result === undefined){

                            return AlimTalkWaterfall.ReSendCheck(result.CMID, callback);
                        }
                        else{
                            callback(0, result);
                        }
                    });
                }, 5000);
          }
          else{
              callback(0, result);
          }
      }],

      AlimTalkWaterfall.Response = function(error, result, callback){

          if(error) throw error;

          res.json({
              code : "0000",
              data : result
          })
          res.end();
      }
    );
});

module.exports = router;
