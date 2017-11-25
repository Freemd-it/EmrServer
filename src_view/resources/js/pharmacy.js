import $ from 'jquery';

$(document).ready(() => {
  if($('#PharmacyOCSTableBody').children().length)
      $('#PharmacyOCSTableBody *').remove();

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/waitingList',
      dataType: 'json',
      cache: false,
  }).done(result => {

      var convertStatus = '';

      for (let i = 0; i < result.length; i++) {

        convertStatus = getStatus(result[i].status);
        $('#PharmacyOCSTableBody').append(
            `<tr id=${result[i].chart_id} class="table-content">
                   <td>${result[i].name}</td>
                   <td>${convertStatus}</td>
            </tr>`
        )}
  });
});

$('.getPharmacyOCS').on('click', () => {

  if($('#PharmacyOCSTableBody').children().length)
      $('#PharmacyOCSTableBody *').remove();

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/waitingList',
      dataType: 'json',
      cache: false,
  }).done(result => {

      var convertStatus = '';

      for (let i = 0; i < result.length; i++) {

        convertStatus = getStatus(result[i].status);
        $('#PharmacyOCSTableBody').append(
            `<tr id=${result[i].chart_id} class="table-content">
                   <td>${result[i].name}</td>
                   <td>${convertStatus}</td>
            </tr>`
        )}
  });
});

$('#pharmacopoeia').on('click', () => {
  $('.ui.longer.modal').modal('show');
});

function getStatus (status) {

    switch (status) {
      case 1 : return '접수'; break;
      case 2 : return '예진'; break;
      case 3 : return '본진'; break;
      case 4 : return '대기'; break;
      case 5 : return '조제'; break;
      case 6 : return '완료'; break;
    }
}
