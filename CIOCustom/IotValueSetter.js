var moment = require('moment');

/**

IOT 플래그 관련 Insert Query Value Setter

*/

var IotValueSetter = function(){};

IotValueSetter.DoorActionDetection = function(requestData){

    var object = {};
    object = DefaultValueSetter(object);

    switch(requestData){

        case "0" : object.messageBody = "창문이 닫혔습니다."; break;
        case "1" : object.messageBody = "창문이 열렸습니다."; break;
        default : return false;
    }

    return object;
}

IotValueSetter.LightingControl = function(requestData){

    var object = {};
    object = DefaultValueSetter(object);

    switch(requestData){

        case "0" : object.messageBody = "소등되었습니다."; break;
        case "1" : object.messageBody = "점등되었습니다."; break;
        default : return false;
    }

    return object;
}

IotValueSetter.GasAlarm = function(requestData){

    var object = {};
    object = DefaultValueSetter(object);

    switch(requestData){

        case "0" : object.messageBody = "대기중 가스 농도가 정상입니다."; break;
        case "1" : object.messageBody = "대기중에 가스가 유출되었습니다. \n가스 밸브를 확인해주세요."; break;
        default : return false;
    }

    return object;
}

IotValueSetter.DustAlarm = function(requestData){

    var object = {};
    object = DefaultValueSetter(object);

    var dustConcentration = Number(requestData);

    if (0 < dustConcentration && dustConcentration < 31) { object.messageBody = "현재 대기내 미세먼지 농도는\n("+dustConcentration+"ug/m3)로 \"좋음\" 상태입니다."; }
    else if (30 < dustConcentration && dustConcentration < 81) { object.messageBody = "현재 대기내 미세먼지 농도는\n("+dustConcentration+"ug/m3)로 \"보통\" 상태입니다."; }
    else if (80 < dustConcentration && dustConcentration < 151) { object.messageBody = "현재 대기내 미세먼지 농도는\n("+dustConcentration+"ug/m3)로 \"나쁨\" 상태입니다."; }
    else if (150 < dustConcentration) { object.messageBody = "현재 대기내 미세먼지 농도는\n("+dustConcentration+"ug/m3)로 \"매우나쁨\" 상태입니다."; }
    else { return false; }

    return object;
}

function DefaultValueSetter(object){

    object.messageType = '7';
    object.cmid = "KAT_"+moment().format("YYYYMMDDHHmmss")+moment().milliseconds();
    object.requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.sendTime = moment().format("YYYY-MM-DD HH:mm:ss");
    object.destinationPhone = "01045843552";
    object.sendPhone = "01045843552";
    object.senderKey = '0cede52df082258ff06b59c92dffff975844c35f';
    object.nationCode = '82';
    object.responseMethod = "realtime";

    return object;
}

module.exports = IotValueSetter;
