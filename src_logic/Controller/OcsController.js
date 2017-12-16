 
/**
 * Defendencies
 */
const express = require('express');
const chartModel = require('../Model/ChartModel.js');
const waitingModel = require('../Model/WaitingModel.js');
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError } = require('../Utils/respond');


/**
 * Entity
 */
const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaintEntity = require('../Entity/Complaint.js');


const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [OCS] OCSController started ##');
    next();
}); 



/**
 * patient id를 통해 vital sign json 데이터 가져오기 
 */
router.get('/now/:patient_id', function (req, res, next) {

    //TODO middleware로 권한체크해야함.

    //condition
    const options = {};
    options.where = { patient_id: 1 }
    options.include = { model: patient }
    options.limit = 10
    options.order = [['createdAt', 'DESC']]

 
    chartModel
        .find(options)
        .then(result => respondJson(res, resultCode.success, result))
        .catch((error) => respondOnError(res, resultCode.fail, error))

})

module.exports = router;
