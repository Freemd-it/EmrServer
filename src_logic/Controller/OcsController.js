
/**
 * Defendencies
 */
const Sequelize = require('sequelize');
const express = require('express');
const ocsModel = require('../Model/OCSModel.js');
const resultCode = require('../Common/ResultCode');
const { respondHtml, respondJson, respondOnError } = require('../Utils/respond');
const moment = require('moment'); 
const _ = require('lodash');
/**
 * Entity
 */
const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const ocs = require('../Entity/OCS.js')

const router = express.Router();

router.use(function log(req, res, next) {
    console.log('## [OCS] OCSController started ##');
    next();
});


router.get('/', (req, res, next) => {
    respondHtml(res, 'ocs');
})

/**
 * 금일 OCS 환자 목록 보기
 */
router.get('/now/:page', function (req, res, next) {

    let { page = 1 } = req.params;
    page = parseInt(page, 10);

    const SIZE = 10; // 한번에 보여줄 글의 수
    const PAGE_SIZE = 10; // 보여주는 링크 수
    const BEGIN = (page - 1) * 10; //시작 글
    const nowTime = moment(new Date());
    const nowDay = nowTime.format('YYYY-MM-DD');

    let totalPage;
    let startPage;
    let endPage;
    let max;

    /**
     *
     * @param {number} cnt 총 ocs 갯수
     * @description
     * 범위 정해서 데이터 전달.
     */
    const tableRange = (cnt) => {
        totalPage = Math.ceil(cnt / SIZE);
        startPage = Math.floor((page - 1) / PAGE_SIZE) * PAGE_SIZE + 1;
        endPage = startPage + (PAGE_SIZE - 1);
        max = cnt - (page - 1) * SIZE;

        if (endPage > totalPage) {
            endPage = totalPage;
        }

        const options = {};
        options.order = [['id', 'DESC']];
        options.where = { createdAt: { lt: Date.parse(nowDay) } }
        options.offset = BEGIN;
        options.limit = SIZE;
        return ocsModel.find(options);
    }

    ocsModel
        .count()
        .then(tableRange)
        .then((datas) => {
            const result = {};
            result.pageSize = PAGE_SIZE;
            result.page = page;
            result.startPage = startPage;
            result.endPage = endPage;
            result.totalPage = totalPage;
            result.max = max;
            result.datas = datas;
            respondJson(res, resultCode.success, result)
        })
        .catch((error) => respondOnError(res, resultCode.fail, error))
})

/**
 * Down OCS Excel
 */
router.get('/excel', function (req, res, next) {

    /**
     * 금일 것만 전달 하도록 할 예정
     */
    const conf = {};
    const nowTime = moment(new Date());
    const nowDay = nowTime.format('YYYY-MM-DD');

    conf.name = "OCS";
    conf.cols = [
        { caption: '차트 번호', type: 'string' },
        { caption: '이름', type: 'string' },
        { caption: '성별', type: 'string' },
        { caption: '생년월일', type: 'string' },
        { caption: '차트 상태', type: 'string' },
        { caption: '진료 날짜', type: 'string' }];

    /**
     * 날짜 제한 걸기
     */
    const options = {};
    options.attributes = ['chartNumber', 'name', 'gender', 'birth', 'status', 'createdAt']
    options.order = [['id', 'DESC']];
    options.where = { createdAt: { lt: Date.parse(nowDay) } }

    ocsModel
        .find(options)
        .then(results => {

            conf.rows = _.map(results, result => _.values(result.get({ plain: true })));
            const excelFile = require('excel-export').execute(conf);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", `attachment; filename=OCS-${nowDay}.xlsx`);
            res.end(excelFile, 'binary');
        })


})

module.exports = router;
