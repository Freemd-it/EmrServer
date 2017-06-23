var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var user = require('../Entity/User.js');

var UserModel = function(data){
    this.data = data;
}

/* Create */
UserModel.Insert = function(callback){

    user.create(
        { account : "test0", password : "passowrd0" }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        if (UserModel.DBErrorCheck(error, callback)) UserModel.Insert(callback);
    });
}

/* Read */
UserModel.List = function(callback){

    user.findAll({
        where : {
          $and : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}]
        },
        limit : 2,
        raw : true
    })
    .then(result => {
        callback(result);
    })
    .catch(error => {
        if (UserModel.DBErrorCheck(error, callback)) UserModel.List(callback);
    });
}

/* Update */
UserModel.Update = function(callback){

    user.update(
        { password : "test123$" },
        { where : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}] }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

/* Delete */
UserModel.Delete = function(callback){

    user.destroy(
        { where : [{account : "test0", password : "passowrd0"}] }
    )
    .then(result => {
        callback(result);
    })
    .catch(error => {
        callback(error);
    });
}

UserModel.DBErrorCheck = function(error, callback){

    if(error.original.errno === 1146){
        user.sync();
        return true;
    }
    else
    {
        callback(error);
    }
}

module.exports = UserModel;
