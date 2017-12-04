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
    medicine.medicineId = $('#prescriptionTableBody').children().eq(i).attr('id');
    medicine.medicineName = $.trim($('#prescriptionTableBody').children().eq(i).children().eq(0).text());
    medicine.ingredient = $.trim($('#prescriptionTableBody').children().eq(i).children().eq(1).text());
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
      console.log(result);
  })

})
