

const express = require('express');
const { respondHtml } = require('../Utils/respond');
const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [TEST] UserController started ##');
    next();
});

router.get('/pharmacy', (req, res, next) => {
    respondHtml(res, 'pharmacy', { auth : req.session.auth });
})

router.get('/originalDiagnosis', (req, res, next) => {
    respondHtml(res, 'originalDiagnosis', { auth : req.session.auth });
});

router.get('/management', (req, res, next) => {
    respondHtml(res, 'management', { auth : req.session.auth });
})

module.exports = router;
