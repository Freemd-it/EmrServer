var chart = require('../Entity/Chart.js');
var complaint = require('../Entity/Complaint.js');
var history = require('../Entity/History.js');
var medicine = require('../Entity/Medicine.js');
var ocs = require('../Entity/OCS.js');
var patient = require('../Entity/Patient.js');
var prescription = require('../Entity/Prescription.js');
var user = require('../Entity/User.js');
var waiting = require('../Entity/Waiting.js');
var medicineCategory = require('../Entity/MedicineCategory.js');

const sequelize = require('./SequelizeService.js');

var EntityService = function(){};

EntityService.Init = function(){

    patient.hasMany( complaint, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    patient.hasMany( history, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    patient.hasMany( chart, { foreignKey : 'patient_id', onUpdate : 'CASCADE' });
    /*
      환자 : CC = 1 : N
      환자 : 과거력 = 1 : N
      환자 : 차트 = 1 : N
    */

    chart.hasMany( complaint, { foreignKey : 'chart_id', onUpdate : 'CASCADE'});
    chart.hasMany( ocs, { foreignKey : 'chart_id', onUpdate : 'CASCADE'});
    chart.hasMany( prescription, { foreignKey: 'chartNumber', sourceKey: 'chartNumber' });
    // chart.hasMany( prescription, { foreignKey: 'chartNumber' });
    chart.belongsTo(patient, { foreignKey : 'patient_id'});
    /*
      차트 : CC = 1 : N
      차트 : OCS = 1 : N
      차트 : 처방 = 1 : 1
    */

    /*
      chart.hasMany => 릴레이션 매핑간 외래키 참조에 의한 오류 발생
      foreign Key, Source Key 동일한 컬럼을 바라보고 있어
      Source Key 명세에 대해 제거 하였음.
    */
   
    medicine.hasMany( prescription, { foreignKey : 'medicine_id', sourceKey : 'id', onUpdate : 'CASCADE'});
    // medicine.hasMany( prescription, { foreignKey : 'medicine_id', onUpdate : 'CASCADE'});
    prescription.belongsTo(medicine, { foreignKey : 'medicine_id'});
    prescription.belongsTo(chart, { foreignKey: 'chartNumber' });

    user.sync();
    patient.sync().then(() => {

        history.sync();
        chart.sync().then(() => {

            complaint.sync();
            ocs.sync();
        });
    });

    medicine.sync().then(() => {

      prescription.sync();
       // const trigger = `create trigger medicine_disable
       //                before update on medicines
       //               for each row
       //               begin if new.amount < 20 then
       //               set new.available = 0;
       //               elseif new.amount >= 20 then
       //               set new.available = 1; end if;
       //               end;`;
       // sequelize.query(trigger);
    });

    medicineCategory.sync();
    waiting.sync();
}

module.exports = EntityService;
