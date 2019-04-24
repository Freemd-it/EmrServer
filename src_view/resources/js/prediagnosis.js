import $ from 'jquery';
import 'jquery-validation';
import { resultCode } from '../utils/constant';
import _ from 'lodash';

/**
 * chrtForm 유효성 검사
 */
 function validateHandler (errorMap, errorList){
     if(this.numberOfInvalids()) {
         $.uiAlert({
             textHead: '[경고]',
             text: errorList[0].message,
             bgcolor: '#FF5A5A',
             textcolor: '#fff',
             position: 'top-center',
             time: 2
         });
         errorList[0].element.focus();
     }
 }

$('#chartForm').validate({
    onkeyup:false,
    onfocusout : function(element){
        $(element).valid();
    },
    rules: {
        heartRate: {
            number: true,
            min: -1
        },
        SpO2: {
            number: true,
            min: -1
        },
        bodyTemporature: {
            number: true,
            min: -1
        },
        systoleBloodPressure: {
            number: true,
            min: -1
        },
        diastoleBloodPressure: {
            number: true,
            min: -1
        },
        bloodGlucose: {
            number: true,
            min: -1
        }
    },
    messages: {
        heartRate: {
            number: "심박수는 숫자 형식으로 입력해주세요",
            min: "심박수는 음수를 입력할 수 없습니다."
        },
        SpO2: {
            number: "산소포화도는 숫자 형식으로 입력해주세요",
            min: "산소포화도는 음수를 입력할 수 없습니다."
        },
        bodyTemporature: {
            number: "체온은 숫자 형식으로 입력해주세요",
            min: "체온은 음수를 입력할 수 없습니다."
        },
        systoleBloodPressure: {
            number: "혈압(수축기)는 숫자 형식으로 입력해주세요",
            min: "혈압(수축기)는 음수를 입력할 수 없습니다."
        },
        diastoleBloodPressure: {
            number: "혈압(이완기)는 숫자 형식으로 입력해주세요",
            min: "혈압(이완기)는 음수를 입력할 수 없습니다."
        },
        bloodGlucose: {
            number: "혈당은 숫자 형식으로 입력해주세요",
            min: "혈당은 음수를 입력할 수 없습니다."
        }
    },
    showErrors:validateHandler
});

$('#CCform').validate({
  onkeyup: false,
  rules: {
    CC: {
      maxlength:255
    },
    HistoryOfCC:{
      maxlength:500
    }
  },
  messages: {
    CC: {
      maxlength: "C.C는 최대 {0}자 까지 입력 가능합니다."
    },
    HistoryOfCC: {
      maxlength: "History Of CC는 최대 {0}자 까지 가능합니다."
    }
  },
  showErrors: validateHandler
});

$('#preDiagonosisWaitingList').on('click', () => {

    if($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status : '1',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        const { data, code } = result;
        if (!_.eq(code, resultCode.success)) {
            return Promise.reject(`get fail waiting list data ${data.error}`);
        }

    }).then((result) => {

      const { data } = result;
      for(let i = 0; i < data.length; i++) {
          $('#tableBody').append(
              `<tr id=${data[i].chartNumber} class="pre-diagnosis-table-content">
                     <td id=${data[i].chartNumber}>${data[i].chartNumber}</td>
                     <td id=${data[i].chartNumber}>${data[i].name}</td>
                     <td id=${data[i].chartNumber}>${data[i].birth}</td>
              </tr>`
          )}
    }).catch(error => console.log(error))

    $('.ui.longer.modal')
        .modal('show');
});

$(document).on('click', '.pre-diagnosis-table-content', (e) => {

    const docs = {
        chartNumber: e.target.id,
    };

    $.ajax({
        type: 'GET',
        url: '/chart',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {
        $('#preChartId').val(result.chartNumber);
        $('#preName').val(result.patient.name);
        $('#preGender').val(result.patient.gender);
        $('#patient_id').val(result.patient_id);
        $('#getPastCC').attr('disabled', false);
        $('#pastDiagnosisRecord').attr('disabled', false);

        let idx = 1; /* 과거력 조회용 인덱스 */
        
        for (let i of result.patient.histories[0].pastHistory) {
                let id = '#disease'+idx;
                if(i == 1) {
                    $(id).prop("checked", true);
                }
                idx++;
            }

            idx = 1;
            for (let i of result.patient.histories[0].allergy) {
                let id = '#allergy'+idx;
                if(i == 1) {
                    $(id).prop("checked", true);
                }
                idx++;
            }
            let value = result.patient.histories[0].pastMedical;

            $('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");

            $('#pastMedicalTime').val(result.patient.histories[0].pastMedicalTime);
            $('#pastMedicalArea').val(result.patient.histories[0].pastMedicalArea);

            value = result.patient.histories[0].pastMedication;

            $('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");

            $('#pastMedicationPeriod').val(result.patient.histories[0].pastMedicationPeriod);
            $('#pastMedicationType').val(result.patient.histories[0].pastMedicationType);

            $('#diseaseDescription').val(result.patient.histories[0].pastHistoryComment);

            $('#allergyDescription').val(result.patient.histories[0].allergyComment)

    }).fail((jq, txt)=>{
        alert(txt);
    })


    $('.ui.longer.modal').modal('hide');
});


/* 예진 완료시 데이터 전송하기 */
$(document).on('click', '.negative.send.ui.button', () => {
    const patient_id = $('#patient_id').val();
    const heartRate = $('#heartRate').val();
    const SpO2 = $('#SpO2').val();
    const bodyTemporature = $('#bodyTemporature').val();
    const systoleBloodPressure = $('#systoleBloodPressure').val();
    const diastoleBloodPressure = $('#diastoleBloodPressure').val();
    const bloodGlucose = $('#bloodGlucose').val();
    const mealTerm = $('#mealTerm').val();
    const chartNumber = $('#preChartId').val();
    const ccData = $('#CCform').serializeArray();
    const pastHistory = getDiseaseHistory();
    const pastHistoryComment = $('#diseaseDescription').val();
    const allergy = getAllergyHistory();
    const allergyComment = $('#allergyDescription').val();
    const pastMedical = $('input[name=pastMedical]:checked').val();
    const pastMedicalTime = $('#pastMedicalTime').val();
    const pastMedicalArea = $('#pastMedicalArea').val();
    const pastMedicationPeriod = $('#pastMedicationPeriod').val();
    const pastMedicationType = $('#pastMedicationType').val();
    const pastMedication = $('input[name=pastMedication]:checked').val();

    const docs = {
        patient_id,
        heartRate,
        SpO2,
        bodyTemporature,
        systoleBloodPressure,
        diastoleBloodPressure,
        bloodGlucose,
        mealTerm,
        chartNumber,
        ccArray: JSON.stringify(ccData),
        updateStatus: 2,
        pastHistory,
        pastHistoryComment,
        allergy,
        allergyComment,
        pastMedical,
        pastMedicalTime,
        pastMedicalArea,
        pastMedicationPeriod,
        pastMedicationType,
        pastMedication,
    };

    $.ajax({
        type: 'POST',
        url: '/chart/update',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {
        if(result.length == 1) {
            $('#chartForm, #CCform').each(function(){
                this.reset();
            });

            if($('#CCsegment').children().length > 0) {
                $('#CCsegment *').remove();
            }

            $('#getPastCC').attr('disabled', true);

            $.uiAlert({
              textHead: '[알림]',
              text: '차트번호 '+chartNumber+' 예진 완료되었습니다.',
              bgcolor: '#19c3aa',
              textcolor: '#fff',
              position: 'top-left',
              time: 2,
            })

            window.scrollTo(0, 0);
            return 0;
        }
    })
});

$('#CCbutton').on('click', () => {
    const ref = $('#CCsegment').children().length;

    $('#CCsegment').append(
        ` <div class="inner-div">
            <button type="button" class="ui red inverted button" style="margin-bottom: 1%">삭제</button>
            <div class="sixteen wide column">
                    <div class="ui fluid input focus">
                        <input name="CC ${ref}" type="text" placeholder="C.C">
                    </div>

                    <div class="ui form" style="margin-top: 1%">
                        <div class="field">
                            <textarea name="HistoryOfCC ${ref}" rows="3" placeholder="History of C.C"></textarea>
                        </div>
                    </div>
                </div>
            </div>`
    );
});

$('#getPastCC').on('click', () => {

    const chartId = $('#preChartId').val();
    const docs = {
        chartId,
    };

    if($('#tablePastBody').children().length)
        $('#tablePastBody *').remove();

    $.ajax({
        type: 'GET',
        url: '/chart/pastAll',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        for(let i = 0; i < result.length; i++) {
            $('#tablePastBody').append(
                `<tr id=${result[i].chartNumber} class="tablecontent">
                        <td id=${result[i].chartNumber}>${result[i].chartNumber}</td>
                        <td id=${result[i].chartNumber}>${result[i].createdAt}</td>
                 </tr>`

             )}
    });

    $('.ui.past.modal').modal('show');
});

$(document).on('click', '.tbody-content', (e) => {

    const chartNumber = e.target.id;

    const docs = {
        chartNumber,
    };

    $.ajax({
        type: 'GET',
        url: '/chart/pastOne',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {
        for(let i = 0; i < result.complaints.length; i++) {
            $('#modalPastCC').append(
                `<div class="inner-div">
                    <button type="button" class="ui red inverted button" style="margin-bottom: 1%" disabled>삭제</button
                    <div class="sixteen wide column">
                        <div class="ui fluid input focus">
                            <input name="CC ${i}" type="text" value='${result.complaints[i].chiefComplaint}' disabled>
                        </div>

                        <div class="ui form" style="margin-top: 1%">
                            <div class="field">
                                <textarea name="HistoryOfCC ${i}" rows="3" disabled>${result.complaints[i].chiefComplaintHistory}</textarea>
                            </div>
                        </div>
                    </div>
                </div>`
            )};
    });

    $('.ui.cc.modal').modal('show');
});

$('#copyButton').on('click', () => {

    $('#firstCC').remove();

    $("#modalPastCC :input").prop("disabled", false);

    const clone = $('#modalPastCC').children().clone();

    if($('#CCsegment').children().length) {

        $('#CCsegment *').remove();
    }

    $('#CCsegment').append(clone);

    $('.ui.cc.modal').modal('hide');

    $('#modalPastCC *').remove();
});

$(document).on('click', '.ui.red.inverted', function(e) {

    e.target.parentNode.remove();
});


const getDiseaseHistory = () => {
    let check = '';

    $('.disease').each(function () {
        $(this).is(':checked') ? check += "1" : check+= "0";
    });

    return check;
};

const getAllergyHistory = () => {
    let check = '';

    $('.allergy').each(function () {
        $(this).is(':checked') ? check += "1" : check+= "0";
    });

    return check;
};