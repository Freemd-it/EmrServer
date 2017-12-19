
/**
 * Defendencies
 */
import $ from 'jquery';
import _ from 'lodash';
import { bb } from "billboard.js";
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import moment from 'moment';

/**
 * init
 */
function init() {

    if (!_.eq(location.pathname, '/views/originalDiagnosis')) return;

    showAndHide('main-hide-and-show-row', 'diagnosis-container');
}
/**
 *
 * @param {string} newId
 * @description
 * tmeplate originalDiagnosis.ejs class main-hide-and-show-row 중
 * 보여주고 있는것은 숨기고 새로운 것을 보여줌
 * default class     main-hide-and-show-row
 * default id           diagosis
 */
const showAndHide = (rowsClass, newId) => {
    //현재 목록 가져온 후 보여주고 있는 row 찾기
    const rows = $(`.${rowsClass}`);
    const findRow = _.find(rows, row => $(row).is(':visible'));
    const { id: findId = "" } = findRow;
    // 다를 경우만 변화
    if (!_.eq(findId, newId)) {
        $(`.${rowsClass}`).hide()
        $(`#${newId}`).show()
    }
}

$('.diagnosisWaitings').on('click', () => {

    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        // console.log(result);
        for (let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="diagnosis-table-content">
                    <td id=${result[i].chart_id}>${result[i].chart_id}</td>
                    <td id=${result[i].chart_id}>${result[i].name}</td>
                    <td id=${result[i].chart_id}>${result[i].birth}</td>
                </tr>`

            )
        }
    });

    $('.ui.longer.modal.waitingPatientList').modal('show');
    $(".completeTab").removeClass("active");
    $(".waitingTab").addClass("active");
});

$('.waitingTab').on('click', () => {
    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        for (let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="diagnosis-table-content">
                       <td id=${result[i].chart_id}>${result[i].chart_id}</td>
                       <td id=${result[i].chart_id}>${result[i].name}</td>
                       <td id=${result[i].chart_id}>${result[i].birth}</td>
                </tr>`

            )
        }
    });

    $(".completeTab").removeClass("active");
    $(".waitingTab").addClass("active");
});

$('.completeTab').on('click', () => {

    if ($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status: '1',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        for (let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="diagnosis-table-content">
                       <td id=${result[i].chart_id}>${result[i].chart_id}</td>
                       <td id=${result[i].chart_id}>${result[i].name}</td>
                       <td id=${result[i].chart_id}>${result[i].birth}</td>
                </tr>`

            )
        }
    });

    $(".waitingTab").removeClass("active");
    $(".completeTab").addClass("active");
});

$(document).on('click', '.diagnosis-table-content', (e) => {

    if ($('#originalDiagnosisCCsegment').children().length)
        $('#originalDiagnosisCCsegment *').remove();
    // 현재 화면에 렌더링 되어있던 CC rows 전체 삭제

    const docs = {
        chartNumber: e.target.id,
        complaintsKey: e.target.id
    };

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        console.log(result)

        $('#preChartId').val(result.chartNumber);
        $('#preName').val(result.patient.name);
        $('#originChartId').val(result.chartNumber);
        $('#originName').val(result.patient.name);
        // 차트 번호, 이름 화면 렌더링

        $('#heartRate').val(result.heartRate);
        $('#pulseRate').val(result.pulseRate);
        $('#bodyTemporature').val(result.bodyTemporature);
        $('#systoleBloodPressure').val(result.systoleBloodPressure);
        $('#diastoleBloodPressure').val(result.diastoleBloodPressure);
        $('#bloodGlucose').val(result.bloodGlucose);
        $('#originName').val(result.patient.name);
        $('#mealTerm').val(result.mealTerm + '시간');
        // 예진 정보 화면 렌더링

        for (var i in result.complaints) {

            $('#originalDiagnosisCCsegment').append(
                ` <div class="inner-div" style="border-color: #ddd;">
                  <div class="sixteen wide column">
                          <div class="ui fluid input focus">
                              <input type="text" placeholder="C.C" value="${result.complaints[i].chiefComplaint}" />
                          </div>

                          <div class="ui form" style="margin-top: 1%">
                              <div class="field">
                                  <textarea rows="3" placeholder="History of C.C">${result.complaints[i].chiefComplaintHistory}</textarea>
                              </div>
                          </div>
                      </div>
                  </div>`
            );
            // CC 갯수에 따라 화면 렌더링
        }

        $('#name').val(result.patient.name);
        $('#gender').val(result.patient.gender);
        $('#birth').val(result.patient.birth.slice(0, 10));
        $('#height').val(result.patient.height + 'cm');
        $('#weight').val(result.patient.weight + 'kg');
        $('#bmi').val(result.patient.BMI);
        $('#smoking').val(result.patient.smokingAmount);
        $('#smokingPeriod').val(result.patient.smokingPeriod);
        $('#drinking').val(result.patient.drinkingAmount);
        $('#drinkingPeriod').val(result.patient.drinkingPeriod);
        // $('#name').val(result.patient.name);
    })

    $('#vitalSign').attr('disabled', false);
    $('#pharmacopoeia').attr('disabled', false);
    $('#pastDiagnosisRecord').attr('disabled', false);
    $('.ui.longer.modal').modal('hide');
});

$('#doctorSignedComplete').on('click', function () {

    var prescriptionLength = $('#prescriptionTableBody').children().length - 1;
    var prescription = [];
    var medicine = {};

    for (var i = 1; i <= prescriptionLength; i++) {
        medicine = {};
        medicine.medicine_id = $('#prescriptionTableBody').children().eq(i).attr('id');
        medicine.chartNumber = $('#preChartId').val();
        medicine.medicineName = $.trim($('#prescriptionTableBody').children().eq(i).children().eq(0).text());
        medicine.medicineIngredient = $.trim($('#prescriptionTableBody').children().eq(i).children().eq(1).text());
        medicine.doses = $('#prescriptionTableBody').children().eq(i).children().eq(2).children().val();
        medicine.dosesCountByDay = $('#prescriptionTableBody').children().eq(i).children().eq(3).children().val();
        medicine.dosesDay = $('#prescriptionTableBody').children().eq(i).children().eq(4).children().val();
        medicine.remarks = $('#prescriptionTableBody').children().eq(i).children().eq(5).children().val();
        prescription.push(medicine);
    }

    var param = {
        chartNumber: $('#preChartId').val(),
        impression: $('.impression').val().replace(/\n/g, "<br>"),
        presentIllness: $('.presentIllness').val().replace(/\n/g, "<br>"),
        treatmentNote: $('.treatmentNote').val().replace(/\n/g, "<br>"),
        updateStatus: 3,
        prescription: JSON.stringify(prescription)
    }

    $.ajax({
        type: 'POST',
        url: '/chart/update',
        data: param,
        dataType: 'json',
        cache: false,
    }).done(result => {

        if (result[0] === 1) {
          
            $('.treatmentNote').val('');
            $('#diagonosisChartForm, #preDiagonosisChartForm, #patient_form').each(function(){
                this.reset();
            });

            if ($('#originalDiagnosisCCsegment').children().length) {
              $('#originalDiagnosisCCsegment *').remove();
            }

            if ($('#prescriptionTableBody').children().length > 0) {
                $('#prescriptionTableBody *').remove();
            }

            $('#pastDiagnosisRecord').attr('disabled', true);
            $('#vitalSign').attr('disabled', true);
            $('#pharmacopoeia').attr('disabled', true);

            $.uiAlert({
                textHead: '[알림]',
                text: '차트번호 ' + param.chartNumber + ' 본진 서명 완료되었습니다.',
                bgcolor: '#19c3aa',
                textcolor: '#fff',
                position: 'top-left',
                time: 2,
            })

            window.scrollTo(0, 0);
        } else {
            alert('[System Error]\n IT 본부 단원에게 문의해주세요.');
        }
    })
})


/**
 *
 * 약전 클릭시
 */
$('#pharmacopoeia').on('click', () => {

    if ($('.main-category-select > select').children().length) {
        $('.main-category-select > select *').remove();
        $('.main-category-select > select').append(
            `<option class='' value=''>대분류</option>`
        )
    }

    if ($('.small-category-select > select').children().length) {
        $('.small-category-select > select *').remove();
        $('.small-category-select > select').append(
            `<option class='default' value=''>소분류</option>`
        )
    }

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/category/main',
        dataType: 'json',
        cache: false,
    }).done(results => {
        /**
         * 데이터 추가 후 modal
         */
        $('.main-category-select > select').append(
            _.map(results, result => `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`)
        );
    });

    $('.ui.longer.modal.pharmacopoeia').modal('show')
    $('.dropdown').dropdown()
    // $(".main-category-select option[value='심혈관계질환']").attr("selected", "selected");
    // console.log($('.main-category-select option').attr('value'));
    // $('.main-category-select > select > option').val();
});

/**
 * 본진 정보 클릭
 */
$('#diagonosis').on('click', () => {
    showAndHide('main-hide-and-show-row', 'diagnosis-container');
})

/**
 * 예진 정보 클릭
 */
$('#preDiagonosis').on('click', () => {
    showAndHide('main-hide-and-show-row', 'pre-diagnosis-container');
})

/**
 * 환자 정보 클릭
 */
$('#patientInfo').on('click', () => {
    showAndHide('main-hide-and-show-row', 'patient-info-container');
})


/**
 * vital sign 생성
 */
$('#vitalSign').on('click', () => {
    showAndHide('main-hide-and-show-row', 'vital-sign-container');

    function _each(data, iter) {
        if (Array.isArray(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                iter(data[i], i, data);
            }
        } else {
            for (let i = 0, keys = Object.keys(data), len = keys.length; i < len; i++) {
                iter(data[keys[i]], keys[i], i, data);
            }
        }
    }

    /**
     *
     * @param {array} vitalDatas
     * @param {array} types      y 축 대상자들
     * @param {string} standard  x 축 기준이 될 것
     */
    const dataInput = (vitalDatas, types, standard) => {
        let new_columns = [];
        const startIndex = 0;
        const notFoundIndex = -1;

        _.each(vitalDatas, (vitalData, vitalIndex) => {
            _each(vitalData, (data, key, i) => {
                // 초기화
                if (!new_columns[i]) {
                    new_columns[i] = [];
                }
                //types 에 포함되어있어야만 push
                if (!_.eq(_.findIndex(types, (type) => type === key), notFoundIndex)) {
                    if (_.eq(vitalIndex, startIndex)) {
                        // key insert
                        if (_.eq(key, standard)) {
                            new_columns[i].push('x');
                        } else {
                            new_columns[i].push(key);
                        }
                    }
                    //value insert
                    if (_.eq(key, standard)) {
                        new_columns[i].push(moment(data).format('YYYY-MM-DD'));
                    } else {
                        new_columns[i].push(data);
                    }
                }
            });
        })
        return new_columns;
    }


    const chartGenerator = _.flow((chartDataInfo) => {
        const { vitalDatas, types, selectGraph } = chartDataInfo;
        const standard = 'createdAt';
        const info = {
            "x": "x",
            "columns": []
        };
        info.columns = dataInput(vitalDatas, types, standard);

        const returnToData = {
            info,
            selectGraph
        }
        return returnToData;

    }, function (result) {
        const { info, selectGraph } = result;


        var chart = bb.generate({
            "data": info,
            "axis": {
                "x": {
                    "type": "timeseries"
                }
            },
            "bindto": `#${selectGraph}`
        });

    })


    /**
     * get data
     */
    const parentId = 1;

    http
        .getMethod(`/chart/vitalSign/${parentId}`)
        .then((result) => {
            const { data, code } = result;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject('fail vital data');
            }
            return Promise.resolve(data);

        }).then(datas => {
            const startArd = 'createdAt';
            // heartRate tinyint(3), # HR 심박수
            // pulseRate tinyint(3), # PR 맥박수
            // bodyTemporature tinyint(3), # BT 체온
            // systoleBloodPressure tinyint(3), # BP 혈압 수축기
            // diastoleBloodPressure tinyint(3), # BP 혈압 이완기
            // bloodGlucose tinyint(3), # Glucose 혈당

            /**
             * generator graph
             */
            const heartRateChart = {
                vitalDatas: datas,
                types: ['createdAt', 'heartRate'],
                selectGraph: 'heartRateChart'
            }
            chartGenerator(heartRateChart);

            const pulseRateChart = {
                vitalDatas: datas,
                types: ['createdAt', 'pulseRate'],
                selectGraph: 'pulseRateChart'
            }
            chartGenerator(pulseRateChart);

            const BloodPressureChart = {
                vitalDatas: datas,
                types: ['createdAt', 'systoleBloodPressure', 'diastoleBloodPressure'],
                selectGraph: 'bloodPressureChart'
            }
            chartGenerator(BloodPressureChart);

            const bloodGlucoseChart = {
                vitalDatas: datas,
                types: ['createdAt', 'bloodGlucose'],
                selectGraph: 'bloodGlucoseChart'
            }
            chartGenerator(bloodGlucoseChart);

            const bodyTemporatureChart = {
                vitalDatas: datas,
                types: ['createdAt', 'bodyTemporature'],
                selectGraph: 'bodyTemporatureChart'
            }
            chartGenerator(bodyTemporatureChart);


        }).catch((error) => {

            /**
             * TODO 실패했을 때 표시
             */
        })

});


init();
