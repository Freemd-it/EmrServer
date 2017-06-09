'use strict';

var dbService = require('../Service/DBService.js');
var config = require('../Common/Config.js');
var querySetter = require('../Common/QuerySetter.js');

var FriendTalkModel = function FriendTalkModel(data) {
    this.data = data;
};

var table = "kmp_msg";

FriendTalkModel.prototype.data = {};

FriendTalkModel.SendMessage = function (insertValues, stamp, callback) {

    var insertFields = ["MSG_TYPE", "CMID", "REQUEST_TIME", "SEND_TIME", "DEST_PHONE", "SEND_PHONE", "SUBJECT", "MSG_BODY", "SENDER_KEY", "NATION_CODE", "RESPONSE_METHOD", "RE_TYPE", "RE_BODY", "ATTACHED_FILE"];
    var queryObject = querySetter.Insert(table, insertValues, insertFields, stamp);

    dbService.Query(queryObject.query, queryObject.fieldAndValue, function (result) {

        callback(result[0]);
    });
};

FriendTalkModel.IotSendMessage = function (insertValues, stamp, callback) {

    var insertFields = ["MSG_TYPE", "CMID", "REQUEST_TIME", "SEND_TIME", "DEST_PHONE", "SEND_PHONE", "SENDER_KEY", "NATION_CODE", "RESPONSE_METHOD", "MSG_BODY"];
    var queryObject = querySetter.Insert(table, insertValues, insertFields, stamp);

    console.log("## Query Start ##");
    console.log(queryObject);
    console.log("## Query End ##");

    var returnObject = {};

    if (queryObject === "Parameter ERROR") {

        returnObject.code = "9999";
        returnObject.cmid = null;
        returnObject.message = "Parameter ERROR";

        callback(returnObject);
    } else {
        dbService.Query(queryObject.query, queryObject.fieldAndValue, function () {

            returnObject.code = "0000";
            returnObject.cmid = queryObject.fieldAndValue[12];
            returnObject.message = "send SUCCESS";

            callback(returnObject);
        });
    }
};

module.exports = FriendTalkModel;
//# sourceMappingURL=FriendTalkModel.js.map