/**

Client Agent에 요청되는 쿼리 Setter

*/
var valueSetter = require("./ValueSetter.js");
var iotValueSetter = require("../CIOCustom/IotValueSetter.js");

var QuerySetter = function(){};

var columnDiv = ",??";
var valueDiv = ",?";

QuerySetter.Insert = function(table, values, fields, stamp){

    var returnObject = {};
    var columnCount = "";
    var valueCount = "";
    var returnArr = [];
    var tempArr = [];

    switch(stamp){

        case "AT" : values = valueSetter.AlimTalk(values); break;
        case "FT" : values = valueSetter.FriendTalk(values); break;
        case "DOOR" : values = iotValueSetter.DoorActionDetection(values); break;
        case "LIGHT" : values = iotValueSetter.LightingControl(values); break;
        case "DUST" : values = iotValueSetter.DustAlarm(values); break;
        case "GAS" : values = iotValueSetter.GasAlarm(values); break;
    }

    if(values === false){ return "Parameter ERROR"; }

    returnArr.push(table);

    for(var i = 0; i < fields.length-1; i++){

        columnCount += columnDiv;
        valueCount += valueDiv;
    }

    for(var j = 0; j < fields.length; j++){

        returnArr.push(fields[j]);
    }

    tempArr = Object.keys(values).map(function (key) { return values[key]; });

    for(var k = 0; k < tempArr.length; k++){

        returnArr.push(tempArr[k]);
    }

    var query = "INSERT INTO ?? (??"+columnCount+") VALUES (?"+valueCount+")";

    returnObject.query = query;
    returnObject.fieldAndValue = returnArr;

    return returnObject;
}

QuerySetter.ResultCheckSelectQuery = function(table, primaryKey, fields){

    var returnObject = {};
    var selectColumnCount = "";
    var returnArr = [];
    var tempArr = [];

    for(var i = 0; i < fields.length-1; i++){

        selectColumnCount += columnDiv;
    }

    tempArr = Object.keys(fields).map(function (key) { return fields[key]; });

    for(var j = 0; j < fields.length; j++){

        returnArr.push(tempArr[j]);
    }

    returnArr.push(primaryKey);

    var query = "SELECT ??"+selectColumnCount+" FROM "+table+" WHERE CMID = ?";

    returnObject.query = query;
    returnObject.selectField = returnArr;

    return returnObject;
}

QuerySetter.ReSendResultCheckSelectQuery = function(table, primaryKey, fields){

    var returnObject = {};
    var selectColumnCount = "";
    var returnArr = [];
    var tempArr = [];

    for(var i = 0; i < fields.length-1; i++){

        selectColumnCount += columnDiv;
    }

    tempArr = Object.keys(fields).map(function (key) { return fields[key]; });

    for(var j = 0; j < fields.length; j++){

        returnArr.push(tempArr[j]);
    }

    returnArr.push(primaryKey);

    var query = "SELECT ??"+selectColumnCount+" FROM "+table+" WHERE ORI_CMID = ?";

    returnObject.query = query;
    returnObject.selectField = returnArr;

    return returnObject;
}

module.exports = QuerySetter;
