/**

<사용하지 않음 / 참조용>
Promise 선언의 기본 형태로
현재 서비스에 사용되지 않는 모듈
추 후 Promise 참조 시 확인할 것

*/

var Promise = require("promise");
var friendTalkModel = require('../model/FriendTalkModel.js');

var FriendTalkPromise = function(){};

FriendTalkPromise.SendResult = function(insertValue){

    return new Promise(function(resolved, rejected){

        setTimeout(function(){

          friendTalkModel.SendMessage(insertValue, function(result, error, callback){

              if(error) throw error;
              console.log(result);
              return result;
          });
        }, 1000);
    });
}

module.exports = FriendTalkPromise;
