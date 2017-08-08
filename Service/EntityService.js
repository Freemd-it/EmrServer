var chart = require('../Entity/Chart.js');
var complaint = require('../Entity/Complaint.js');
var history = require('../Entity/History.js');
var medicine = require('../Entity/Medicine.js');
var ocs = require('../Entity/OCS.js');
var patient = require('../Entity/Patient.js');
var permission = require('../Entity/Permission.js');
var prescription = require('../Entity/Prescription.js');
var user = require('../Entity/User.js');
var waiting = require('../Entity/Waiting.js');

const sequelize = require('./SequelizeService.js');

var EntityService = function(){};

EntityService.Init = function(){

    permission.hasMany( user, { foreignKey : 'permission_id' });
    /*
      권한 : 사용자 = 1 : N
    */

    patient.hasMany( complaint, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    patient.hasMany( history, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    patient.hasMany( chart, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    /*
      환자 : CC = 1 : N
      환자 : 과거력 = 1 : N
      환자 : 차트 = 1 : N
    */

    chart.hasMany( complaint, { foreignKey : 'chart_id', onUpdate : 'CASCADE' });
    chart.hasMany( ocs, { foreignKey : 'chart_id', onUpdate : 'CASCADE' });
    chart.hasOne( prescription, { foreignKey : 'chart_id', onUpdate : 'CASCADE' });
    /*
      차트 : CC = 1 : N
      차트 : OCS = 1 : N
      차트 : 처방 = 1 : 1
    */

    permission.sync().then(() => {

        user.sync();
    });

    patient.sync().then(() => {

        history.sync();
        chart.sync().then(() => {

            complaint.sync();
            prescription.sync();
            ocs.sync();
        });
    });

    waiting.sync();
    medicine.sync();
}

module.exports = EntityService;
