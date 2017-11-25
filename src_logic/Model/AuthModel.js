var config = require('../../Config');

var AuthModel = function (data) {
    this.data = data;
}

var table = "users";

AuthModel.prototype.data = {};

AuthModel.Auth = function(insertValues, stamp, callback){

    // TODO Login Logic

}

module.exports = AuthModel;
