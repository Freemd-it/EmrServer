var sequelize = require('sequelize');
var dbService = require('../Service/SequelizeService.js');
var patient = require('../Entity/Patient.js');
let history = require('../Entity/History');

var ReceiptModel = function(data) {
  this.data = data;
}

/* Read */
ReceiptModel.FindAll = function(name, callback) {
  patient.findAll({
      attributes: ['id', 'name', 'bmi', 'birth', 'height', 'weight', 'createdAt', 'gender', 'drinkingAmount', 'smokingAmount', 'smokingPeriod', 'drinkingPeriod', 'firstVisit'],
      where: {
        name
      },
      include: {
        model: history,
      }
    })
    .then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

ReceiptModel.Find = function(id, callback) {
  patient.find({
      where: {
        id
      },
      attributes: ['id', 'name', 'bmi', 'birth', 'height', 'weight', 'createdAt', 'gender', 'drinkingAmount', 'smokingAmount', 'smokingPeriod', 'drinkingPeriod', 'firstVisit'],
      include: {
        model: history
      }
    })
    .then(result => {
      callback(result);
    })
    .catch(error => {
      callback(error);
    });
}

ReceiptModel.UpdateOrCreate = function(data, callback) {

  const birth = data.birth + 'T00:00:00.000Z';

  patient.find({
      where: {
        name: data.name,
        birth: data.birth
      },
      attributes: ['id', 'name', 'bmi', 'birth', 'height', 'weight', 'createdAt', 'gender', 'drinkingAmount', 'smokingAmount', 'smokingPeriod', 'drinkingPeriod', 'firstVisit'],
      include: {
        model: history,
      }
    }).then(result => {
      if (result) {
        const passingResult = result;

        result.update({
          name: data.name,
          gender: data.gender,
          birth: data.birth,
          height: data.height,
          weight: data.weight,
          BMI: data.BMI,
          smokingAmount: data.smokingAmount,
          smokingPeriod: data.smokingPeriod,
          drinkingAmount: data.drinkingAmount,
          drinkingPeriod: data.drinkingPeriod,
        }, {
          include: {
            model: history,
          }
        }).then(result => {
          result.histories[0].update({
            pastHistory: data.pastHistory,
            pastHistoryComment: data.pastHistoryComment,
            allergy: data.allergy,
            allergyComment: data.allergyComment,
            pastMedical: data.pastMedical,
            pastMedicalTime: data.pastMedicalTime,
            pastMedicalArea: data.pastMedicalArea,
            pastMedicationPeriod: data.pastMedicationPeriod,
            pastMedicationType: data.pastMedicationType,
            pastMedication: data.pastMedication,
          }).then(() => {
            passingResult['sqlStatus'] = 200;
            callback(passingResult);
          });
        })
      } else {
        patient.create({
          firstVisit: sequelize.fn('NOW'),
          name: data.name,
          gender: data.gender,
          birth: data.birth,
          height: data.height,
          weight: data.weight,
          BMI: data.BMI,
          smokingAmount: data.smokingAmount,
          smokingPeriod: data.smokingPeriod,
          drinkingAmount: data.drinkingAmount,
          drinkingPeriod: data.drinkingPeriod,
          histories: {
            pastHistory: data.pastHistory,
            pastHistoryComment: data.pastHistoryComment,
            allergy: data.allergy,
            allergyComment: data.allergyComment,
            pastMedical: data.pastMedical,
            pastMedicalTime: data.pastMedicalTime,
            pastMedicalArea: data.pastMedicalArea,
            pastMedicationPeriod: data.pastMedicationPeriod,
            pastMedicationType: data.pastMedicationType,
            pastMedication: data.pastMedication,
          }
        }, {
          include: [history]
        }).then(result => {
          result['sqlStatus'] = 200;
          callback(result);
        })
      }
    })
    .catch(error => {
      callback(error);
    });
}

module.exports = ReceiptModel;
