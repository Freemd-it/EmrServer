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

router.get('/list', (req, res) => {

  var param = req.query;

  medicineModel.List( param, result => {
    res.send(result);
  })
})

router.get('/search', (req, res) => {

  var param = req.query;

  medicineModel.Search( param, result => {
    res.send(result);
  })
})

router.get('/dummy', (req, res) => {

  var response = [
    {
      medicine: '부루펜정',
      ingredient: 'Ibuprofen 200mg',
      medication: '1회 300 mg을 1일 2 ~ 4회 경구투여한다.(1일 최대 1.2g)',
      property: ''
    }
  ]
});

module.exports = router;
