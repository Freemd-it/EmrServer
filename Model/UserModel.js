var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');

var UserModel = function(data){
    this.data = data;
}

const User = dbService.define('users', {

    account : sequelize.STRING(50),
    password : sequelize.STRING
});

UserModel.CreateTable = () =>{

    User.sync().then((result) => {

        console.log(result);
        callback(result);
    });
}

/* Create */
UserModel.Insert = function(callback){

    User.create(
        { account : "test0", password : "passowrd0" }
    )
    .then(result => {
        callback(result);
    })
    .on("error" => {
        console.log("error");
        console.log(error);
        callback(error);
    });
}

/* Read */
UserModel.List = function(callback){

    User.findAll({
        where : {
          $and : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}]
        },
        limit : 2,
        raw : true
    })
    .then(result => {
        callback(result);
    });
}

/* Update */
UserModel.Update = function(callback){

    User.update(
        { password : "test123$" },
        { where : [{ id : {$lt : 3}}, {account : {$like : "%test%"}}] }
    )
    .then(result => {
        callback(result);
    });
}

/* Delete */
UserModel.Delete = function(callback){

    User.destroy(
        { where : [{account : "test0", password : "passowrd0"}] }
    )
    .then(result => {
        callback(result);
    });
}

module.exports = UserModel;
