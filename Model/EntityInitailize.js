var user = require('../Entity/User');
var chart = require('../Entity/Chart');

console.log("실행안되나?");

user.hasMany(chart, { foreignKey : 'user_id', onUpdate : 'CASCADE', onDelete : 'CASCADE'});

user.sync().then(() => {

    chart.sync();
});

console.log("실행 ???");
