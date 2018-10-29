
/**
 * Defendencies
 */
const express = require('express');
const chartModel = require('../Model/ChartModel');
const waitingModel = require('../Model/WaitingModel');
const ocsModel = require('../Model/OCSModel');
const resultCode = require('../Common/ResultCode');
const { respondJson, respondOnError } = require('../Utils/respond');


/**
 * Entity
 */
const prescription = require('../Entity/Prescription');
const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaint = require('../Entity/Complaint.js');
const history = require('../Entity/History.js');

const router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [Chart] ChartController started ##');
    next();
});

router.get('/', function (req, res) {

    chartModel.getChartByChartNumber(req.query, result => {
        res.send(result);
    });
});

router.post('/update', function (req, res) {

    const data = {
        status: req.body.updateStatus,
        chartNumber: req.body.chartNumber,
    };

    history.update({
        pastHistory: req.body.pastHistory,
        pastHistoryComment: req.body.pastHistoryComment,
        allergy: req.body.allergy,
        allergyComment: req.body.allergyComment,
        pastMedical: req.body.pastMedical,
        pastMedicalTime: req.body.pastMedicalTime,
        pastMedicalArea: req.body.pastMedicalArea,
        pastMedicationPeriod: req.body.pastMedicationPeriod,
        pastMedicationType: req.body.pastMedicationType,
        pastMedication: req.body.pastMedication,
      }, {
        where: { patient_id: req.body.patient_id},
      })
      .then((result) => {
          console.log("RESULT => ", result)
        chartModel.updateChartByChartNumber(req.body, result => {
            waitingModel.Update(data, result => {
                const options = {};
                options.update = { status: data.status };
                options.where = { chartNumber: data.chartNumber }
                ocsModel.update(options)
                .then(result => {
                    res.send(result);
                })
                .catch(error => {
                    res.send(error);
                })
            });
        })
      })
      .catch(error => {
          res.send(error)
      })
});

router.get('/pastAll', function (req, res) {

    chartModel.getPastChart(req.query, result => {
        res.send(result)
    });

});

router.get('/pastOne', function (req, res) {

    chartModel.getOnePastChart(req.query, result => {
        res.send(result);
    });

});

/**
 * patient id를 통해 vital sign json 데이터 가져오기
 */
router.get('/vitalSign/:patient_id', function (req, res, next) {
    const { patient_id } = req.params;
    //TODO middleware로 권한체크해야함.

    //condition
    const options = {};
    options.where = { patient_id: patient_id }
    options.include = { model: patient }
    options.limit = 10
    options.order = [['createdAt', 'DESC']]


    chartModel
        .find(options)
        .then(result => respondJson(res, resultCode.success, result))
        .catch((error) => respondOnError(res, resultCode.fail, error))

});

/**
 * @description 과거 진료 기록 조회 (복약지도까지 완료된 것만)
 */
router.get('/past/:patient_id', function (req, res, next) {

    const { patient_id } = req.params;

    const options = {};
    options.attributes = ['id', 'chartNumber', 'patient_id']
    options.where = { patient_id: patient_id, status: '7' }
    options.order = [['updatedAt', 'DESC']]

    chartModel
        .findAll(options)
        .then(result => respondJson(res, resultCode.success, result))
        .catch((error) => respondOnError(res, resultCode.fail, error))
});

/**
 * @description get 과거력 포함한 환자정보, 진료정보, CC 포함한 예진 정보 api
 * 총 5개의 테이블을 조인하는데 다른 방법이 있으면 찾아보는 것도 좋을 듯함
 */
router.get('/detail/:chartId/:patientId/:chartNumber', function (req, res, next) {

    const { chartId, patientId, chartNumber } = req.params

    const options = {};
    options.where = { id: chartId }
    options.include = [
        { model: prescription,
          where: { chartNumber: chartNumber } },
        { model: patient,
          where: { id: patientId },
          attributes: ['name']},
        { model: complaint,
          where: { chart_id: chartId } }
    ]

    chartModel
        .findAll(options)
        .then(result => respondJson(res, resultCode.success, result))
        .catch(error => { console.log(error); respondOnError(res, resultCode.fail, error)})
});

module.exports = router;
