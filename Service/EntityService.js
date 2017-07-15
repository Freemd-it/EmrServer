var user = require('../Entity/User');
var chart = require('../Entity/Chart');

var EntityService = function(){};

EntityService.Init = function(){

    user.hasMany(chart, { foreignKey : 'user_id', onUpdate : 'CASCADE', onDelete : 'CASCADE'});

    user.sync().then(() => {

        chart.sync();
    });
}

module.exports = EntityService;
