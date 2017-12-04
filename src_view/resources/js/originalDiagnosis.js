import $ from 'jquery';

$('.diagnosisWaitings').on('click', () => {

    if($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status : '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        // console.log(result);
        for(let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="table-content">
                    <td id=${result[i].chart_id}>${result[i].chart_id}</td>
                    <td id=${result[i].chart_id}>${result[i].name}</td>
                    <td id=${result[i].chart_id}>${result[i].birth}</td>
                </tr>`

            )}
    });

    $('.ui.longer.modal.waitingPatientList').modal('show');
    $(".completeTab").removeClass("active");
    $(".waitingTab").addClass("active");
});

$('.waitingTab').on('click', () => {

    if($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status : '2',
    };

    $.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        for(let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="table-content">
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

        for(let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="table-content">
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
      url: 'http://localhost:3000/chart/update',
      data: param,
      dataType: 'json',
      cache: false,
  }).done(result => {
      if(result[0] === 1) {

        $('#preChartId').val('');
        $('#preName').val('');
        $('.impression').val('');
        $('.presentIllness').val('');
        $('.treatmentNote').val('');

        if($('#prescriptionTableBody').children().length > 0) {
            $('#prescriptionTableBody *').remove();
        }

        $('#pastDiagnosisRecord').attr('disabled', true);
        $('#vitalSign').attr('disabled', true);
        $('#pharmacopoeia').attr('disabled', true);

        $.uiAlert({
          textHead: '[알림]',
          text: '차트번호 '+param.chartNumber+' 본진 서명 완료되었습니다.',
          bgcolor: '#19c3aa',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
      } else {
        alert('[System Error]\n IT 본부 단원에게 문의해주세요.');
      }
  })

})
