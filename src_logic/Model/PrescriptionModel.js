const sequelize = require('sequelize');
const prescription = require('../Entity/Prescription.js');
var dbService = require('../Service/SequelizeService.js');

var PrescriptionModel = function () {}

PrescriptionModel.createAll = function (data, callback) {

    var medicines = JSON.parse(data.prescription);
    prescription.bulkCreate(medicines).then(result => callback(result));
}

PrescriptionModel.find = async function (options) {

    return await prescription.findAll(options)
}

PrescriptionModel.findOne = async function (options) {

    const { where = {}, order = [] } = options;
    return await prescription.findOne({
        where: where,
        order: order
    })
}

PrescriptionModel.create = async function (data) {

    return await prescription.create(data)
}

PrescriptionModel.update = async function (options) {

    const { where = {}, update = {} } = options;
    return await prescription.update(update, {
        where: where
    })
}

PrescriptionModel.delete = async function (options) {

    const { where = {} } = options;
    return await prescription.destroy({
      where: where
    })
}


PrescriptionModel.history = async function(options) {

  return await dbService.query(historyCustomQuery(options), { type: sequelize.QueryTypes.SELECT })
}

function historyCustomQuery (options) {
  return `select p.id, p.medicineName, p.medicineIngredient, sum(p.useTotal) as total, p.createdAt,
  m.id, m.primaryCategory, m.secondaryCategory, m.totalAmount, m.quantity
  from prescriptions as p inner join medicines as m on p.medicine_id = m.id where p.useFlag = '1' and
  p.createdAt between '${options.where.createdAt.between[0]}' and '${options.where.createdAt.between[1]}'
  group by p.medicine_id`;
}

module.exports = PrescriptionModel;
