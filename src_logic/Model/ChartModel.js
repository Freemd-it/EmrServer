const chart = require('../Entity/Chart.js');
const patient = require('../Entity/Patient.js');
const complaint = require('../Entity/Complaint.js');
const _ = require('lodash');
let history = require('../Entity/History');


const complaintModel = require('./ComplaintModel');
const ocsModel = require('./OCSModel');
const medicineModel = require('./MedicineModel');
const prescriptionModel = require('./PrescriptionModel');
const moment = require('moment');

var ChartModel = function (data) {
    this.data = data;
}

ChartModel.create = function (data, callback) {

    const chartDate = moment(new Date()).format('YYYYMMDD')

    chart.findAll({
        where: {
            chartNumber: {
                $gt: chartDate + '00',
            }
        }
    }).then(results => {
        const num = results.length > 8 ? results.length + 1 : '0' + (results.length + 1);
        chart.create({
            patient_id: data.id,
            chartNumber: chartDate + num,
        }).then(result => {
            result['name'] = data.name;
            ocsModel.receipt(data, result, ocsResult => {
              callback(result)
            })
        })
    });

}

ChartModel.getChartByChartNumber = function (data, callback) {

    chart.find({
        where: {
            chartNumber: data.chartNumber
        },
        include: [
            {
                model: patient,
                include: [
                  history
                ]
            }
        ]
    }).then(result => {

        const chartInfo = result

        if (data.complaintsKey) {
            return new Promise(function GETComplaints(resolve, reject) {
                complaintModel.findAllByChartId(result.id, result => {
                    chartInfo.dataValues.complaints = result
                    callback(chartInfo)
                })
            })
        } else {
            callback(chartInfo)
        }
    })
}


/**
 * @function updateChartByChartNumber
 * @description 예진 ~ 약국 종료까지 차트 업데이트하는 로직, 리팩토링 필요함
 * 상태 업데이트별로 추가로 콜 해야하는 함수들이 다르니 유의 필요
 * @param  {[type]}   data     update argument
 * @param  {Function} callback
 */
ChartModel.updateChartByChartNumber = function (data, callback) {

    const statusInPharmacy = ['4', '5', '6'];
    // 조제 시작 = 4, 조제 완료 = 5, 파트장 검수 완료 = 6

    if (data.updateStatus === '2') {
        chart.update({
            status: 2,
            heartRate: data.heartRate ? data.heartRate : 0,
            heartRate: data.heartRate ? data.heartRate : 0,
            pulseRate: data.pulseRate ? data.pulseRate : 0,
            bodyTemporature: data.bodyTemporature ? data.bodyTemporature : 0,
            systoleBloodPressure: data.systoleBloodPressure ? data.systoleBloodPressure : 0,
            diastoleBloodPressure: data.diastoleBloodPressure ? data.diastoleBloodPressure : 0,
            bloodGlucose: data.bloodGlucose ? data.bloodGlucose : 0,
            mealTerm: data.mealTerm ? data.mealTerm : 0,
        }, {
                where: {
                    chartNumber: data.chartNumber
                }
            }).then(results => {

                complaintModel.Insert(data, result => {
                  if (result === 1) {
                    ocsModel.preDiagonosis(data.chartNumber, callback)
                  }
                })
            })
    }
    else if (data.updateStatus === '3') {
        let medicines = JSON.parse(data.prescription);
        chart.update({
            status: 3,
            impression: data.impression,
            presentIllness: data.presentIllness,
            treatmentNote: data.treatmentNote,
        }, {
                where: {
                    chartNumber: data.chartNumber
                }
            }).then(result => {

                /**
                 * @description 약 총 사용 수 계산 : 1회 투약량 * 1일 복용횟수(ex. qd, bid, tid, hs) * 복용일수 = 약 총 사용량
                 */
                var totalSum = JSON.parse(data.prescription)
                totalSum.forEach((record) => {
                  record.useTotal = record.doses * statusConvert(record.dosesCountByDay) * record.dosesDay
                })
                data.prescription = JSON.stringify(totalSum)

                prescriptionModel.createAll(data, result => {
                  ocsModel.originalDiagnosis(data.chartNumber, callback)
                });
            })
    }
    else if (statusInPharmacy.includes(data.updateStatus)) {

        chart.update({
            status: data.updateStatus,
        },
        {
          where: {
            chartNumber: data.chartNumber
          }
        })
        .then(result => {
          callback(result)
        })
        .catch(error => {
          callback(error)
        })
    }
    else if (data.updateStatus === '7') {

        chart.update({
            status: data.updateStatus,
        },
        {
          where: {
            chartNumber: data.chartNumber
          }
        })
        .then(result => {

          const options = {};
          options.where = { chartNumber: data.chartNumber }
          options.order = [['id']];

          prescriptionModel
              .find(options)
              .then(results => {

              const flagUpdateOptions = {}
              flagUpdateOptions.update = { useFlag: 1 }
              flagUpdateOptions.where = { id: _.map(results, result => { return result.id}) }

              const clearanceParam = _.map(results, result => {
                const row = {};
                row.medicine_id = result.dataValues.medicine_id;
                row.integerToSubstract = (result.dataValues.doses) * statusConvert(result.dataValues.dosesCountByDay) * result.dataValues.dosesDay;
                return row
              });

              /**
               * @description prescriptions 테이블 내 useFlag 업데이트 후 medicines 테이블에서 남은 약 갯수 차감
               */
              prescriptionModel
              .update(flagUpdateOptions)
              .then(result => {

                   /**
                    * @function lastCallback
                    * @description custom update query 세팅 후 실행
                    * sequelize 모듈에 case when 사용 가능한 update 쿼리 모듈이 없음
                    */
                   medicineModel
                   .clearance(setCustomUpdateQuery(clearanceParam))
                   .then(result => {
                   /* status 7일 때 컨트롤러로 최종 콜백하는 부분 */
                     callback(result)
                   })
                   .catch(error => {
                     callback(error)
                   })
               })

              /**
               * @function setCustomUpdateQuery
               * @param {Array} array 업데이트될 내용을 담고 있는 배열 (id가 42일 때 amount 컬럼을 -30 한다.)
               * @description update medicines set amount = case when id = 42 then amount - 30 when id = 43 then amount - 20 end where id in (42, 43);
               * 위와 같은 형식의 다중 조건 쿼리를 문자열로 만들어줌
               */
              function setCustomUpdateQuery (array) {

                  const inArray = [];
                  const whenArray = [];

                  var now = moment().format('YYYY-MM-DD HH:mm:ss');
                  var query = `update medicines set updatedAt = '${now}', amount = case`;
                  var index = 0;

                  array.forEach((data) => {
                    index = inArray.indexOf(data.medicine_id);
                    if (index === -1) {
                      whenArray.push({medicine_id: data.medicine_id, integerToSubstract: data.integerToSubstract});
                      inArray.push(data.medicine_id);
                    } else {
                      whenArray[index].integerToSubstract += data.integerToSubstract;
                    }
                  })

                  whenArray.forEach((data) => {
                    query += ` when id = ` + data.medicine_id + ` then amount - ` + data.integerToSubstract;
                  })

                  query += ` end where id in (`;

                  inArray.forEach((data, index) => {
                    if (index === inArray.length - 1) query += data + `)`;
                    else query += data + `, `;
                  })

                  return query;
              }
             })
             .catch(error => {
               callback(error)
             })
        })
        .catch(error => {
          callback(error)
        })
    }
}

ChartModel.getPastChart = function (data, callback) {

    const chartDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const chartFindAll = (result) => {

        return chart.findAll({
            where: {
                patient_id: result.dataValues.patient_id,
                $and: {
                    chartNumber: {
                        $lt: chartDate + '00',
                    }
                }
            },
            limit: 10,
            order: [['chartNumber', 'DESC']],
        });

    }

    chart.find({
        where: {
            chartNumber: data.chartId,
        },
    })
        .then(chartFindAll)
        .then(result => callback(result))

}

ChartModel.getOnePastChart = function (data, callback) {

    chart.find({
        where: {
            chartNumber: data.chartNumber,
        },
        include: {
            model: complaint,
        }
    }).then(result => callback(result));

}


ChartModel.find = async function (options) {

    const { where = {}, include = {}, limit = 1, order = [] } = options;

    if (limit) {
        return await chart.findAll({
            where: where,
            include: include,
            order: order,
            limit: limit
        })
    } else {
        return await chart.findOne({
            where: where,
            include: include,
            order: order
        })
    }

}

ChartModel.findAll = async function (options) {

    const { where = {}, include = {}, order = [] } = options;

    return chart.findAll({
        where: where,
        include: include,
        order: order
    })
}

function statusConvert (param) {
  switch (param) {
    case 'qd' : return 1; break;
    case 'bid' : return 2; break;
    case 'tid' : return 3; break;
    case 'hs' : return 4; break;
  }
}

module.exports = ChartModel;
