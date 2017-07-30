var user = require('../Entity/User');
var chart = require('../Entity/Chart');
const sequelize = require('./SequelizeService');
const patients = require('../Entity/Patient');
var EntityService = function(){};

EntityService.Init = function(){

    user.hasMany(chart, { foreignKey : 'user_id', onUpdate : 'CASCADE', onDelete : 'CASCADE'});

    user.sync().then(() => {

        chart.sync();
        patients.sync();
    });
}

module.exports = EntityService;
