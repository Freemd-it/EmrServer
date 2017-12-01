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

  if ($('.main-category-select > select').children().length) {
    $('.main-category-select > select *').remove();
    $('.main-category-select > select').append(
        `<option value=''>대분류</option>`
    )}

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/category/main',
      dataType: 'json',
      cache: false,
  }).done(result => {
      for (let i = 0; i < result.length; i++) {
        $('.main-category-select > select').append(
            `<option value='${result[i].primaryCategory}'> ${result[i].primaryCategory} </option>`
        )}
  });
  $('.ui.longer.modal').modal('show');
});

$('.main-category-select').change( () => {
  var param = {
    primaryCategory : $('.main-category-select option:selected').attr('value')
  }

  if ($('.small-category-select > select').children().length) {
    $('.small-category-select > select *').remove();
    $('.small-category-select > select').append(
        `<option value=''>소분류</option>`
    )}

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/category/small',
      data: param,
      dataType: 'json',
      cache: false,
  }).done(result => {
      for (let i = 0; i < result.length; i++) {
        if(i === 0) {

          $('.small-category-select > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

          $('.small-category-select > select').append(
              `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
          )}
          else {
          $('.small-category-select > select').append(
              `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
          )}
        }

  });
})



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
