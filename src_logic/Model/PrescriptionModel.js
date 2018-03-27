const sequelize = require('sequelize');
const prescription = require('../Entity/Prescription.js');
const medicine = require('../Entity/Medicine');

var PrescriptionModel = function (data) {
    this.data = data;
}

PrescriptionModel.createAll = function (data, callback) {

    var medicines = JSON.parse(data.prescription);
    prescription.bulkCreate(medicines).then(result => callback(result));
}

PrescriptionModel.find = async function (options) {

    // const { where = {}, include = {}, order = [] } = options;
    // return await prescription.findAll({
    //     where: where,
    //     order: order
    // })
    console.log(typeof prescription)
    console.log(prescription.toString())
    console.log(options)
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

  // console.log(typeof prescription)
  // console.log(prescription.toString())
  // console.log(typeof options.include.model)
  return await prescription.findAll(options)
}

module.exports = PrescriptionModel;
