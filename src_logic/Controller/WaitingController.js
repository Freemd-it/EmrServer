const express = require('express');
const waitingModel = require('../Model/WaitingModel.js');
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError, respondHtml } = require('../Utils/respond');
const _ = require('lodash');
const moment = require('moment');
const router = express.Router();

router.use(function log(req, res, next) {

  console.log('## [WaitList] WaitController started ##');
  next();
});

router.get('/', (req, res) => {

  const nowDay = moment('00:00:00', 'hh:mm:ss');
  const status = req.query.status

  if (typeof status === 'undefined') {
    waitingModel.FindAll(result => {
      res.send(result);
    });
  } else {

    const options = {};
    options.order = [['chartNumber', 'ASC']];
    options.attributes = ['chartNumber', 'name', 'birth', 'status'];
    options.where = { status: status , createdAt: {gt: Date.parse(nowDay)} }
    waitingModel
        .FindByStatus(options)
        .then(result => {
          respondJson(res, resultCode.success, result);
        })
        .catch(error => {
          respondOnError(res, resultCode.fail, error);
        })
  }
});

router.get('/pharmacy/now/:page', (req, res) => {

  let { page = 1 } = req.params;
  page = parseInt(page, 15);

  const SIZE = 15;
  const PAGE_SIZE = 4;
  const BEGIN = (page - 1) * 15;
  const nowTime = moment(new Date());
  const nowDay = moment('00:00:00', 'hh:mm:ss');

  let totalPage;
  let startPage;
  let endPage;
  let max;

  const tableRange = (cnt) => {
    totalPage = Math.ceil(cnt / SIZE);
    startPage = Math.floor((page - 1) / PAGE_SIZE) * PAGE_SIZE + 1;
    endPage = startPage + (PAGE_SIZE - 1);
    max = cnt - (page - 1) * SIZE;

    if(endPage > totalPage) {
      endPage = totalPage;
    }

    const viewPermission = ['super'];
    const options = {};
    options.order = [['chartNumber', 'ASC']];

    options.where = { createdAt: {gt: Date.parse(nowDay)} }
    if (!viewPermission.includes(req.session.auth)) options.where.status = {ne: 7}
    options.offset = BEGIN;
    options.limit = SIZE;

    return waitingModel.FindByPharmacy(options);
  }

  waitingModel
          .Count({ where : { createdAt: {gt: Date.parse(moment('00:00:00', 'hh:mm:ss'))}}})
          .then(tableRange)
          .then((datas) => {
            const result = {
              pageSize : PAGE_SIZE,
              page : page,
              startPage : startPage,
              endPage : endPage,
              totalPage : totalPage,
              max : max,
              datas : (req.session.auth === 'normal') ? toNormalMember(datas) : datas
            }
            respondJson(res, resultCode.success, result)
          })
          .catch((error) => respondOnError(res, resultCode.fail, error))
});

function toNormalMember (datas) {
  return _.filter(datas, data => {
    return data.status === 4
  })
}

module.exports = router;
