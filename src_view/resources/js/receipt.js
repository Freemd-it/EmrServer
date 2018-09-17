import $ from 'jquery';
import 'jquery-validation';

/**
 * patient form 유효성 검사
 */
$('#patient_form').validate({
    onkeyup:false,
    onfocusout : function(element){
        $(element).valid();
    },
    rules:{
        name: {
            required: true,
            rangelength: [2, 10]
        },
        birth: {
          required: true,
          dateISO: true
        },
        height: {
          min: 1,
          number: true
        },
        weight: {
          min: 1,
          number: true
        },
        bmi: {
          number: true
        },
        smoking: {
            number: true,
            min: 0
        },
        smokingPeriod: {
            number: true
        },
        drinking: {
            number: true,
            min: 0
        },
        drinkingPeriod: {
            number: true
        }
    },
    messages:{
        name: {
            required: "이름을 입력해주세요",
            rangelength: "이름을 2자에서 10자 사이로 입력해주세요"
        },
        birth: {
          required: "생년월일을 정확히 입력해주세요",
          dateISO: "생년월일을 정확히 입력해주세요"
        },
        height: {
          min: "신장은 0이 될 수 없습니다.",
          numbers: "신장을 양의 실수 형식으로 입력해주세요"
        },
        weight: {
          min: "체중은 0이 될 수 없습니다.",
          numbers: "체중을 양의 정수 형식으로 입력해주세요"
        },
        bmi: {
          number: "bmi 지수가 정확하기 않습니다. 신장과 체중을 다시 확인해주세요!"
        },
        smoking: {
          number: "흡연량을 숫자 형식으로 입력해주세요",
          min: "흡연량은 음수를 입력할 수 없습니다"
        },
        smokingPeriod: {
          numbers: "흡연경력을 양의 정수 형식으로 입력해주세요"
        },
        drinking: {
          number: "음주량을 숫자 형식으로 입력해주세요",
          min: "음주량은 음수를 입력할 수 없습니다"
        },
        drinkingPeriod: {
          numbers: "음주경력을 양의 정수 형식으로 입력해주세요"
        }
    },
    showErrors:function(errorMap, errorList){
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
});

/**
 * 엔터 search버튼 임포팅
 */

 $('#nameInput').keydown(function(){
    if(event.keyCode == 13){
       $('#btn-name-send').trigger('click');
    }
});

/**
 * 이름으로 조회
 */
$('#btn-name-send').on('click', () => {

    const name = $.trim($('#nameInput').val());
    let docs;
    let date;
    let idx = 1;

    $('#name').attr({
        disabled: false,
    });

    $('#birth').attr({
        disabled: false,
    });

    $('.ui.dropdown').removeClass("disabled");

    if(!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    docs = {
        name,
    };

    $.ajax({
        type: 'GET',
        url: '/receipt/patients',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done((result) => {

        if(!result.length) {


            $('#nameMessage').html('[ ' + name + ' ]' + ' 님에 대한 정보가 없습니다.');

            $('#message').attr({
                class: 'ui negative message',
                hidden: false,
            });

            setTimeout(() => {
                $('#message')
                    .closest('.message')
                    .transition('fade')
            }, 1000);

            $('#nameInput').val('');
            $('#name').val(name);
            $('#name').val(name);
            $('#height').val('');
            $('#weight').val('');
            $('#drinking').val('');
            $('#smoking').val('');
            $('#birth').val('');
            $('#smokingPeriod').val('');
            $('#drinkingPeriod').val('');
            $('#bmi').val('');

            date = new Date();
            $('#firstcome').val(date.getFullYear() + ' 년 ' + (date.getMonth()+1) + ' 월 ' + date.getDate() + ' 일 ');


            return;
        }

        // 검색결과가 있을 떄 
        if(result.length == 1) {

            $('#nameMessage').html('[ ' + result[0].name + ' ]' + ' 님이 조회됐습니다.');

            $('#message').attr({
                class: 'ui positive message',
                hidden: false,
            });

            setTimeout(() => {
                $('#message')
                    .closest('.message')
                    .transition('fade')
            }, 1000);


            $('#nameInput').val('');

            $('#name').attr("disabled", true).val(result[0].name);


            $('#height').val(result[0].height);

            $('#weight').val(result[0].weight);

            $('#drinking').val(result[0].drinkingAmount);

            $('#smoking').val(result[0].smokingAmount);

            $('#smokingPeriod').val(result[0].smokingPeriod);

            $('#drinkingPeriod').val(result[0].drinkingPeriod);
            $('#bmi').val(result[0].bmi);

            date = new Date(result[0].firstVisit).toISOString().slice(0,10);

            $('#firstcome').val(date);

            date = new Date(result[0].birth).toISOString().slice(0,10);

            $('#birth').attr("disabled", true).val(date);

            $('#gender').dropdown('set selected', result[0].gender);

            $('.ui.dropdown').addClass("disabled");


        } else {
            // 검색 결과가 여러명 일때 
            $('#nameInput').val('');


            if($('#list').children().length)
                $('#list *').remove();

            for(let i = 0; i < result.length; i++) {
                date = new Date(result[i].birth);
                $('#nameInput').val('');
                $('#list').append(
                    '  <div id=' + result[i].id + '  class="item homonym-item" align="middle">\n' +
                    '                    <div id=' + result[i].id + ' class="content">\n' +
                    '                        <div id=' + result[i].id + ' class="header">' + result[i].name +'</div>\n' +
                    '                        ' + date.getFullYear() + ' 년 ' + (date.getMonth()+1) + ' 월 ' + date.getDate() + ' 일 '+
                    '                    </div>\n' +
                    '                </div>');

            }

            $('.ui.basic.modal')
                .modal('show');
        }
    });
});

/**
 * 동명이인 id로 조회
 */
$(document).on('click', '.homonym-item', (e) => {
    let date;
    let idx = 1;
    const docs = {
        id: e.target.id,
    };


    $.ajax({
        type: 'GET',
        url: '/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done((result) => {
        $('#nameMessage').html('[ ' + result.name + ' ]' + ' 님이 조회됐습니다.');

        $('#message').attr({
            class: 'ui positive message',
            hidden: false,
        });

        setTimeout(() => {
            $('#message')
                .closest('.message')
                .transition('fade')
        }, 1000);


        $('#nameInput').val('');

        $('#name').attr("disabled", true).val(result.name);


        $('#height').val(result.height);

        $('#weight').val(result.weight);

        $('#drinking').val(result.smokingAmount);

        $('#smoking').val(result.drinkingAmount);

        $('#smokingPeriod').val(result.smokingPeriod);

        $('#drinkingPeriod').val(result.drinkingPeriod);

        $('#bmi').val(result.bmi);

        date = new Date(result.firstVisit).toISOString().slice(0,10);

        $('#firstcome').val(date);

        date = new Date(result.birth).toISOString().slice(0,10);

        $('#birth').attr("disabled", true).val(date);

        $('#gender').dropdown('set selected', result.gender);

        $('.ui.dropdown').addClass("disabled");



        $('.ui.basic.modal')
            .modal('hide');
    })
});


$('.ui.dropdown')
    .dropdown();

$('.ui.checkbox')
    .checkbox();

$('#weight, #height').change(() => {
    const weight = $('#weight').val();
    const height = $('#height').val()/100;
    const bmi = weight/(height*height);

    $('#bmi').val(bmi.toFixed(5));
});

$('input[name="pastMedical"]').on('change', () => {
    const type = $('input[name="pastMedical"]:checked').val();

    if(type === 'N' ) {
        $('#pastMedicalTime').prop('disabled', true);
        $('#pastMedicalArea').prop('disabled', true);
    }

    if(type === 'Y' ) {
        $('#pastMedicalTime').prop('disabled', false);
        $('#pastMedicalArea').prop('disabled', false);
    }
});

$('input[name="pastMedication"]').on('change', () => {
    const type = $('input[name="pastMedication"]:checked').val();

    if(type === 'N' ) {
        $('#pastMedicationPeriod').prop('disabled', true);
        $('#pastMedicationType').prop('disabled', true);
    }

    if(type === 'Y' ) {
        $('#pastMedicationPeriod').prop('disabled', false);
        $('#pastMedicationType').prop('disabled', false);
    }
});



$('#sendToPart2').on('click', () => {

    if(!$('#patient_form').valid()){
      return;
    }

    let docs;

    const name = $('#name').val();
    const birth = $('#birth').val();
    const height = $('#height').val();
    const weight = $('#weight').val();
    const BMI = $('#bmi').val();
    const gender = $('#gender').val();
    const smokingAmount = $('#smoking').val();
    const smokingPeriod = $('#smokingPeriod').val();
    const drinkingAmount = $('#drinking').val();
    const drinkingPeriod = $('#drinkingPeriod').val();

    if(!gender || gender === ''){
      $.uiAlert({
          textHead: '[경고]',
          text: '성별을 입력해주세요!',
          bgcolor: '#FF5A5A',
          textcolor: '#fff',
          position: 'top-center',
          time: 2
      });

      return;
    }

    docs = {
        name,
        birth,
        height,
        weight,
        BMI,
        gender,
        smokingAmount,
        smokingPeriod,
        drinkingAmount,
        drinkingPeriod,
    };

    $.ajax({
        type: 'POST',
        url: '/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done((result) => {
        window.scrollTo(0, 0);

        $('#patient_form').each(function(){
            this.reset();
        });

        $('#gender').dropdown('set selected', 'male');

        $.uiAlert({
          textHead: '[알림]',
          text: name+'님의 접수가 완료되었습니다.',
          bgcolor: '#19c3aa',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
    });

});
