const express = require('express');
const waitingModel = require('../Model/WaitingModel.js');
const prescriptionModel = require('../Model/PrescriptionModel.js');
const chartModel = require('../Model/ChartModel.js');
const chart = require('../Entity/Chart');
const patient = require('../Entity/Patient');
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError, respondHtml } = require('../Utils/respond');
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

        const prescriptions = result
        options.include = { model: patient }

        chartModel
            .find(options)
            .then(result => {
                result[0].dataValues.prescriptions = prescriptions
                respondJson(res, resultCode.success, result[0]);
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

  prescriptionModel
      .create(data)
      .then(result => {
        respondJson(res, resultCode.success, result);
      })
      .catch((error) =>{
        respondOnError(res, resultCode.fail, error)
      })
});

module.exports = router;
