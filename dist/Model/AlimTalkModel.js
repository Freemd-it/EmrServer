'use strict';

var moment = require('moment');

var dbService = require('../Service/DBService.js');
var config = require('../Common/Config.js');
var querySetter = require('../Common/QuerySetter.js');

var AlimTalkModel = function AlimTalkModel(data) {
    this.data = data;
};

var messageTable = "kmp_msg";
var logTable = "kmp_log_" + String(moment().format("YYYYMM"));
var stamp = "AT";

AlimTalkModel.prototype.data = {};

AlimTalkModel.SendMessage = function (insertValues, callback) {

    var insertFields = ["MSG_TYPE", "CMID", "REQUEST_TIME", "SEND_TIME", "DEST_PHONE", "SEND_PHONE", "MSG_BODY", "TEMPLATE_CODE", "SENDER_KEY", "NATION_CODE", "RESPONSE_METHOD", "RE_TYPE", "RE_BODY", "ATTACHED_FILE"];
    var queryObject = querySetter.Insert(messageTable, insertValues, insertFields, stamp);

    dbService.Query(queryObject.query, queryObject.fieldAndValue, function () {

        callback(queryObject.fieldAndValue[16]); // 16번 값 = CMID 값
    });
};

AlimTalkModel.SendResultCheck = function (primaryKey, callback) {

    var selectFields = ["MSG_TYPE", "CMID", "UMID", "REQUEST_TIME", "CALL_STATUS"];
    var queryObject = querySetter.ResultCheckSelectQuery(messageTable, primaryKey, selectFields);

    dbService.Query(queryObject.query, queryObject.selectField, function (result) {

        callback(result[0]);
    });
};

AlimTalkModel.ReSendResultCheck = function (primaryKey, callback) {

    var selectFields = ["MSG_TYPE", "TEL_INFO", "STATUS", "CMID", "UMID", "REQUEST_TIME", "CALL_STATUS"];
    var queryObject = querySetter.ReSendResultCheckSelectQuery(messageTable, primaryKey, selectFields);

    dbService.Query(queryObject.query, queryObject.selectField, function (result, error) {

        callback(result[0]);
    });
};

module.exports = AlimTalkModel;
//# sourceMappingURL=AlimTalkModel.js.map