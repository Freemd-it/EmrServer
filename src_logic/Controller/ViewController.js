

const express = require('express');
const { respondHtml } = require('../Utils/respond');
const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [TEST] UserController started ##');
    next();
});

router.get('/receipt', (req, res, next) => {
    respondHtml(res, 'receipt');
})

router.get('/ocs', (req, res, next) => {
    respondHtml(res, 'ocs');
})

router.get('/prediagnosis', (req, res, next) => {
    respondHtml(res, 'prediagnosis');
})

router.get('/pharmacy', (req, res, next) => {
    respondHtml(res, 'pharmacy');
})

router.get('/originalDiagnosis', (req, res, next) => {
    respondHtml(res, 'originalDiagnosis');
});

router.get('/management', (req, res, next) => {
    respondHtml(res, 'management');
})

module.exports = router;
