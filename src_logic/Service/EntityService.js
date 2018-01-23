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
var medicineCategory = require('../Entity/MedicineCategory.js');

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

    chart.hasMany( complaint, { foreignKey : 'chart_id', onUpdate : 'CASCADE', hooks: true});
    chart.hasMany( ocs, { foreignKey : 'chart_id', onUpdate : 'CASCADE', hooks: true});
    chart.belongsTo(patient, { foreignKey : 'patient_id', hooks: true});
    /*
      차트 : CC = 1 : N
      차트 : OCS = 1 : N
      차트 : 처방 = 1 : 1
    */

    medicine.hasMany( prescription, { foreignKey : 'medicine_id', onUpdate : 'CASCADE', hooks: true});

    permission.sync().then(() => {

        user.sync();
    });

    patient.sync().then(() => {

        history.sync();
        chart.sync().then(() => {

            complaint.sync();
            ocs.sync();
        });
    });

    medicine.sync().then(() => {

      prescription.sync();

      const trigger = `create trigger medicine_disable
                       before update on medicines
                       for each row
                       begin if new.amount < 20 then
                       set new.available = 0;
                       elseif new.amount >= 20 then
                       set new.available = 1; end if;
                       end;`;
      sequelize.query(trigger);
    });

    medicineCategory.sync();
    waiting.sync();
}

module.exports = EntityService;
