const express = require('express');
const { respondHtml } = require('../Utils/respond');
const router = express.Router();

router.use(function log(req, res, next) {
    if (req.session.auth === 'normal') {
      return res.redirect('back')
    }
    console.log('## [OriginalDiagnosis] OriginalDiagnosisController started ##');
    next();
});

router.get('/', (req, res, next) => {

  respondHtml(res, 'originalDiagnosis', { auth : req.session.auth });
})

module.exports = router;
