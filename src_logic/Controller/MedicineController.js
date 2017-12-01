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
    console.log(result);
    res.send(result);
  });
});

router.get('/category/main', (req, res) => {

  medicineCategoryModel.ListSmall( result => {
    console.log(result);
    res.send(result);
  });
});

module.exports = router;
