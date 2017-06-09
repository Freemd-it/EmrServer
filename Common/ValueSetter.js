var moment = require('moment');

/**

<카카오 GW 전용>
알림톡 & 친구톡 고정 Insert Query Value Setter

*/

var ValueSetter = function(){};

ValueSetter.AlimTalk = function(requestData){

    var object = {};

    object.messageType = '6';
    object.cmid = "KAT_"+moment().format("YYYYMMDDHHmmss");
    object.requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.destinationPhone = requestData.destinationPhone;
    object.sendPhone = requestData.sendPhone;
    object.messageBody = requestData.messageBody;
    object.templateCode = requestData.templateCode;
    object.senderKey = requestData.senderKey;
    object.nationCode = '82';
    object.responseMethod = "realtime";
    object.reSendType = requestData.reSendType;
    object.reSendMessageBody = requestData.reSendMessageBody;
    object.attachedFile = requestData.attachedFile;

    return object;
}

ValueSetter.FriendTalk = function(requestData){

    var object = {};

    object.messageType = '7';
    object.cmid = "KAT_"+moment().format("YYYYMMDDHHmmss");
    object.requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.destinationPhone = requestData.destinationPhone;
    object.sendPhone = requestData.sendPhone;
    object.subject = requestData.subject;
    object.messageBody = requestData.messageBody;
    object.senderKey = requestData.senderKey;
    object.nationCode = '82';
    object.responseMethod = "realtime";
    object.reSendType = requestData.reSendType;
    object.reSendMessageBody = requestData.reSendMessageBody;
    object.attachedFile = requestData.attachedFile;

    return object;
}

module.exports = ValueSetter;
