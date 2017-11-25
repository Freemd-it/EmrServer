import $ from 'jquery';

$('.diagnosisWaitings').on('click', () => {

    if($('#tableBody').children().length)
        $('#tableBody *').remove();

    const docs = {
        status : '2',
    };

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
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

    $('.ui.longer.modal').modal('show');
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

            )
        }
    });

    $(".waitingTab").removeClass("active");
    $(".completeTab").addClass("active");
});
