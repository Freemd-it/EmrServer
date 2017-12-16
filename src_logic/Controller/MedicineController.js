const express = require('express');
const medicineModel = require('../Model/medicineModel.js');
const medicineCategoryModel = require('../Model/MedicineCategoryModel.js');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [Medicine] MedicineController started ##');
  next();
});

router.get('/category/main', (req, res) => {

  medicineCategoryModel.listMain( result => {
    res.send(result);
  });
});

router.get('/category/small', (req, res) => {

  medicineCategoryModel.listSmall( req.query, result => {
    res.send(result);
  });
});

router.get('/list', (req, res) => {

  var param = req.query;

  medicineModel.list( param, result => {
    res.send(result);
  })
})

router.get('/search', (req, res) => {

  var param = req.query;

  medicineModel.search( param, result => {
    res.send(result);
  })
})

module.exports = router;
