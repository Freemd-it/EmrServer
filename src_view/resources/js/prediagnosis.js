import $ from 'jquery';

$('#waitingList').on('click', () => {

    if($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status : '1',
    };

    console.log("waitList Callback");
    console.log("waitList Callback");
    console.log("waitList Callback");

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        console.log(result);
        for(let i = 0; i < result.length; i++) {
            $('#tableBody').append(
                `<tr id=${result[i].chart_id} class="table-content">
                       <td id=${result[i].chart_id}>${result[i].chart_id}</td>
                       <td id=${result[i].chart_id}>${result[i].name}</td>
                       <td id=${result[i].chart_id}>${result[i].birth}</td>
                </tr>`

            )}
    });

    $('.ui.longer.modal')
        .modal('show');

});

$(document).on('click', '.table-content', (e) => {

    console.log(e.target);
    const docs = {
        chartNumber: e.target.id,
    };

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {

        $('#preChartId').val(result.chartNumber);
        $('#preName').val(result.patient.name);

        $('#getPastCC').attr('disabled', false);
        $('#pastDiagnosisRecord').attr('disabled', false);
        $('#vitalSign').attr('disabled', false);
    })


    $('.ui.longer.modal').modal('hide');
});

$(document).on('click', '.negative.send.ui.button', () => {
    const heartRate = $('#heartRate').val();
    const pulseRate = $('#pulseRate').val();
    const bodyTemporature = $('#bodyTemporature').val();
    const systoleBloodPressure = $('#systoleBloodPressure').val();
    const diastoleBloodPressure = $('#diastoleBloodPressure').val();
    const bloodGlucose = $('#bloodGlucose').val();
    const mealTerm = $('#mealTerm').val();
    const chartNumber = $('#preChartId').val();
    const ccData = $('#CCform').serializeArray();

    const docs = {
        heartRate,
        pulseRate,
        bodyTemporature,
        systoleBloodPressure,
        diastoleBloodPressure,
        bloodGlucose,
        mealTerm,
        chartNumber,
        ccArray : JSON.stringify(ccData),
    };

    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/chart/update',
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
        url: 'http://localhost:3000/chart/pastAll',
        data: docs,
        dataType: 'json',
        cache: false,
    }).done(result => {
        console.log(result);
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
        url: 'http://localhost:3000/chart/pastOne',
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
