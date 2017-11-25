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
        callback(error);
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
        callback(error);
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

UserModel.FindAndCreate = function(data, callback){

    user.findAll({

    })
}

module.exports = UserModel;
