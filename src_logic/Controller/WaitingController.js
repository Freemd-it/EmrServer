const express = require('express');
const waitingModel = require('../Model/WaitingModel.js');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [WaitList] WaitController started ##');
  next();
});

router.get('/', (req, res) => {

  if (typeof req.query.status === 'undefined') {
    waitingModel.FindAll(result => {
      res.send(result);
    });
  } else {
    waitingModel.FindByStatus(req.query.status, result => {
      // console.log(result);
      res.send(result);
    });
  }
});

module.exports = router;
