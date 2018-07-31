const express = require('express');
const medicineModel = require('../Model/MedicineModel.js');
const medicineCategoryModel = require('../Model/MedicineCategoryModel.js');
const router = express.Router();
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError, respondHtml } = require('../Utils/respond');

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

router.get('/list/management', (req, res) => {

  var param = req.query;

  medicineModel.list( param, result => {
    res.send(result);
  })
})

router.get('/list', (req, res) => {

  const options = {};
  options.attributes = ['id', 'name', 'primaryCategory', 'secondaryCategory', 'medication', 'property', 'ingredient', 'amount', 'quantity', 'available'];
  options.where = { available: 1 }

  medicineModel
  .listTwo(options) // 활성 상태인 약들만 출력
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    res.send(error);
  })
})

router.get('/search', (req, res) => {

  var param = req.query;

  medicineModel.search( param, result => {
    res.send(result);
  })
})

router.post('/insert', (req, res)=>{

  medicineModel
  .create(req.body)
  .then(result =>{
    respondJson(res,resultCode.success, result);
  })
  .catch(err =>{
    respondOnError(res, resultCode.fail, err);
  });

});

router.post('/delete', (req, res)=>{

  const { medicineIds } = req.body
  const options = {};
  options.where = JSON.parse(medicineIds);

  medicineModel
    .delete(options)
    .then(result =>{
      respondJson(res, resultCode.success, result);
    })
    .catch(err =>{
      respondOnError(res, resultCode.fail, err);
    });
});

router.post('/update', (req, res)=>{

  medicineModel
    .update(req.body)
    .then(result =>{
      respondJson(res, resultCode.success, result);
    })
    .catch(err =>{
      respondOnError(res, resultCode.fail, err);
    });

});

module.exports = router;
