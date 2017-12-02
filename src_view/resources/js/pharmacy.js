import $ from 'jquery';

var tableRenderMedicine = [];

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

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/list',
      dataType: 'json',
      cache: false,
  }).done(result => {

      window.localStorage.setItem('medicine', JSON.stringify(result));
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
        `<option class='default' value=''>대분류</option>`
    )}

  if ($('.small-category-select > select').children().length) {
    $('.small-category-select > select *').remove();
    $('.small-category-select > select').append(
        `<option class='default' value=''>소분류</option>`
    )}

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/category/main',
      dataType: 'json',
      cache: false,
  }).done(result => {
      for (var i = 0; i < result.length; i++) {

          $('.main-category-select > select').append(
              `<option value='${result[i].primaryCategory}'> ${result[i].primaryCategory} </option>`
          )}
  });
  $('.ui.longer.modal.pharmacopoeia').modal('show');
});

$('.main-category-select').change( () => {
  var param = {
    primaryCategory : $('.main-category-select option:selected').attr('value')
  }

  if ($('.small-category-select > select').children().length) {
    $('.small-category-select > select *').remove();
    $('.small-category-select > select').append(
        `<option class='default' value=''>소분류</option>`
    )}

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/category/small',
      data: param,
      dataType: 'json',
      cache: false,
  }).done(result => {
      for (i in result) {
        if(i === '0') {

          $('.small-category-select > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

          $('.small-category-select > select').append(
              `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
          )
          var medicine = JSON.parse(window.localStorage.getItem('medicine'));
          var categoryMain = $('.main-category-select option:selected').text();
          var categorySmall = $('.small-category-select option:selected').text();
          tableRenderMedicine = [];

          medicine.find(function (x) {
            if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
              tableRenderMedicine.push(x);
            }
          });

          if($('#medicineTableBody').children().length)
              $('#medicineTableBody *').remove();

          for (var i = 0; i < tableRenderMedicine.length; i++) {
            $('#medicineTableBody').append(
                `<tr id=${tableRenderMedicine[i].id} class='pharmacopoeia-hover'>
                       <td>${tableRenderMedicine[i].name}</td>
                       <td>${tableRenderMedicine[i].ingredient}</td>
                       <td>${tableRenderMedicine[i].medication}</td>
                       <td>${tableRenderMedicine[i].property}</td>
                </tr>`
            )}
        }
        else {
          $('.small-category-select > select').append(
              `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
          )}
        }
  });
})

$('.small-category-select').change( () => {
  var medicine = JSON.parse(window.localStorage.getItem('medicine'));
  var categoryMain = $('.main-category-select option:selected').text();
  var categorySmall = $('.small-category-select option:selected').text();
  tableRenderMedicine = [];

  medicine.find(function (x) {
    if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
      tableRenderMedicine.push(x);
    }
  });

  if($('#medicineTableBody').children().length)
      $('#medicineTableBody *').remove();

  for (var i = 0; i < tableRenderMedicine.length; i++) {
    $('#medicineTableBody').append(
        `<tr id=${tableRenderMedicine[i].id} class='pharmacopoeia-hover'>
               <td>${tableRenderMedicine[i].name}</td>
               <td>${tableRenderMedicine[i].ingredient}</td>
               <td>${tableRenderMedicine[i].medication}</td>
               <td>${tableRenderMedicine[i].property}</td>
        </tr>`
    )}
})

$('.pharmacySearchButton').on('click', () => {

  $('.main-category-select > select > .default').attr('selected', 'selected');
  $('.small-category-select > select > .default').attr('selected', 'selected');
  $('.main-category-select > select').nextAll('div.text').text('대분류');
  $('.small-category-select > select').nextAll('div.text').text('소분류');

  var searchText = $('input[name=medicineSearchText]').val();
  var option = $('.medicineSearchSelect option:selected').val();
  var param = {
    searchText : searchText,
    option: option
  }

  $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/medicine/search',
      data: param,
      dataType: 'json',
      cache: false,
  }).done(result => {

    if($('#medicineTableBody').children().length)
        $('#medicineTableBody *').remove();

    for (var i in result) {
      $('#medicineTableBody').append(
          `<tr id=${result[i].id} class='pharmacopoeia-hover'>
                 <td>${result[i].name}</td>
                 <td>${result[i].ingredient}</td>
                 <td>${result[i].medication}</td>
                 <td>${result[i].property}</td>
          </tr>`
      )}
  });
})

$(document).on('click', '.pharmacopoeia-hover', (e) => {

  if($('#prescriptionTableBody .defaultPrescriptionTableBody').length)
      $('#prescriptionTableBody .defaultPrescriptionTableBody').remove();

  JSON.parse(window.localStorage.getItem('medicine')).find(function (x) {
    if (x.id === Number(e.currentTarget.id)) {
      $('#prescriptionTableBody').append(
        `<tr id=${x.id}'>
               <td>${x.name}</td>
               <td>${x.ingredient}</td>
               <td><input /></td>
               <td><input /></td>
               <td><input /></td>
               <td><input /></td>
               <td class="deletePrescriptionTD">
                <i class="sign out icon delete-icon-size deleteTargetByIcon"></i>
               </td>
         </tr>`
      )
      $.uiAlert({
        textHead: 'INFO', // header
        text: '처방전에 '+x.name+'이(가) 추가되었습니다.', // Text
        bgcolor: '#55a9ee', // background-color
        textcolor: '#fff', // color
        position: 'top-left',// position . top And bottom ||  left / center / right
        time: 2, // time
      })
      // console.log(x);
    }
  })
})

$(document).on('click', '.deleteTargetByIcon', (e) => {
  $(e.target).parent().parent().remove();
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
