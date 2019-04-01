const express = require('express');
const waitingModel = require('../Model/WaitingModel.js');
const prescriptionModel = require('../Model/PrescriptionModel.js');
const chartModel = require('../Model/ChartModel.js');
const chart = require('../Entity/Chart');
const patient = require('../Entity/Patient');
const medicine = require('../Entity/Medicine');
const resultCode = require('../Common/ResultCode');
const sequelize = require('sequelize');
const { respondJson, respondOnError, respondHtml } = require('../Utils/respond');
const util = require('../Utils/util');
const _ = require('lodash');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [Prescription] PrescriptionController started ##');
  next();
});

router.get('/:chartNumber', (req, res) => {

  const { chartNumber } = req.params;

  const options = {};
  options.where = { chartNumber: chartNumber }
  options.order = [['id', 'ASC']]

  prescriptionModel
      .find(options)
      .then(result => {

        const viewPermission = ['super', 'pharmacist', '3partLeader'];
        const prescriptions = result
        options.include = [{ model: patient, required: true }]

        chartModel
            .find(options)
            .then(result => {
                viewPermission.includes(req.session.auth) ? result[0].dataValues.viewPermission = true : result[0].dataValues.viewPermission = false
                result[0].dataValues.prescriptions = prescriptions
                respondJson(res, resultCode.success, result[0]);
            })
            .catch(error => {
                console.log(error)
                respondOnError(res, resultCode.fail, error)
            })
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.get('/medicine/:prescriptionId', (req, res) => {

  const { prescriptionId } = req.params;

  const options = {};
  options.where = { id: prescriptionId }
  options.order = [['id', 'ASC']]

  prescriptionModel
      .findOne(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/update', (req, res) => {

  const { prescriptionId } = req.body;
  delete req.body.prescriptionId;
  const data = req.body;
  data.useTotal = data.doses * util.convertDoseCount(data.dosesCountByDay) * data.dosesDay

  const options = {};
  options.update = data
  options.where = { id: prescriptionId }

  prescriptionModel
      .update(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/delete', (req, res) => {

  const { prescriptionId } = req.body;

  const options = {};
  options.where = { id: prescriptionId }

  prescriptionModel
      .delete(options)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.post('/create', (req, res) => {

  const data = req.body;
  if (!data.useTotal) data.useTotal = data.doses * util.convertDoseCount(data.dosesCountByDay) * data.dosesDay

  prescriptionModel
      .create(data)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

router.get('/history/:startTime/:endTime/:category', (req, res)=>{

  var { category, startTime, endTime } = req.params
  const { word } = req.query
  startTime += ' 00:00:00'
  endTime += ' 23:59:59'

  const options = {}
  prescriptionModel.prescription.hasMany(medicine)
  options.include = [{model: medicine, attributes: [], required: true}] 
  options.raw = true
  options.group = ['medicine.id']
  options.where = { useFlag: '1', createdAt: {between: [startTime, endTime]} }
  options.attributes = ['medicine.primaryCategory', 'medicine.secondaryCategory', 
    'medicine.name', 'medicine.ingredient',
    'medicine.totalAmount', 'medicine.quantity',
    [sequelize.fn('SUM', sequelize.col('prescription.useTotal')), 'totalUsage'], 'createdAt']
  
  console.log(options)
  if (word.length > 0) {
    (category === '1') ? options.where.medicineName = { like: `%` + word + `%` } : options.where.medicineIngredient = { like: `%` + word + `%` }
  }

  prescriptionModel
    .find(options)
    .then(result => {
      respondJson(res, resultCode.success, result)
    })
    .catch(error => {
      console.log(error)
      respondOnError(res, resultCode.fail, error)
    })
});


module.exports = router;
