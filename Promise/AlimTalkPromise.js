/**

<사용하지 않음 / 참조용>
파라메터 전달 이슈로 사용하지 않는 모듈
연산이 들어간 object 데이터에 대해 promise를 호출한 모듈로 resolving 할 수 없음

*/
var Promise = require("promise");
var alimTalkModel = require('../model/AlimtalkModel.js');

var AlimTalkPromise = function(){};

AlimTalkPromise.Send = function(insertValue){

    return new Promise(function(resolve, reject){

        alimTalkModel.SendMessage(insertValue, function(result, error){

              if(error) throw error;
              resolve(result);
        });
    });
}

AlimTalkPromise.SendResultCheck = function(primaryKey){

    return new Promise(function(resolve, reject){

        setTimeout(function(){
            alimTalkModel.SendResultCheck(primaryKey, function(result, error){

                  if(error) throw error;

                  switch(result.CALL_STATUS)
                  {
                      case "9" : AlimTalkPromise.SendResultCheck(primaryKey); break; // 발송 대기
                      case "7318" : AlimTalkPromise.SendResultCheck(result.UMID); break; // 대체 발송 수행중
                      case undefined : AlimTalkPromise.SendResultCheck(result.UMID); break;
                      case "1000" : resolve(result); // 발송 성공
                      default : console.log("default in"); console.log(result); console.log("default end"); resolve(result); break; // 그 외 실패 내역
                  }
            });
        }, 5000);
    });
}

module.exports = AlimTalkPromise;
