const express = require('express');
const medicineModel = require('../Model/medicineModel.js');
const medicineCategoryModel = require('../Model/MedicineCategoryModel.js');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [Medicine] MedicineController started ##');
  next();
});

router.get('/category/main', (req, res) => {

  medicineCategoryModel.ListMain( result => {
    res.send(result);
  });
});

router.get('/category/small', (req, res) => {

  medicineCategoryModel.ListSmall( req.query, result => {
    res.send(result);
  });
});

module.exports = router;
