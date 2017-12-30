import $ from 'jquery';

var tableRenderMedicine = [];

/**
 * init
 */
function init() {

  if (!_.eq(location.pathname, '/views/pharmacy')) return;

  $('.ui.dropdown')
    .dropdown();

  if ($('#PharmacyOCSTableBody').children().length)
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
      )
    }
  });

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/medicine/list',
    dataType: 'json',
    cache: false,
  }).done(result => {

    window.localStorage.setItem('medicine', JSON.stringify(result));

    var getAutoCompleteNameObject = [];
    var getAutoCompleteIngredientObject = [];
    result.find((x) => {
      getAutoCompleteNameObject.push({ 'title': x.name });
      getAutoCompleteIngredientObject.push({ 'title': x.ingredient.replace(/<br>/g, " ") });
    });

    window.localStorage.setItem('medicineName', JSON.stringify(getAutoCompleteNameObject));
    window.localStorage.setItem('medicineIngredient', JSON.stringify(getAutoCompleteIngredientObject));

    $('.search.ui')
      .search({
        source: JSON.parse(window.localStorage.getItem('medicineName'))
      });
  });
}


$('.medicineSearchSelect').change(() => {

  var sourceTarget;

  if ($('.medicineSearchSelect option:selected').val() === '1') {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
  } else {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
  }
  $('.search.ui').search({ source: sourceTarget })
});

$('.getPharmacyOCS').on('click', () => {

  if ($('#PharmacyOCSTableBody').children().length)
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
      )
    }
  });
});

$('.main-category-select').change(() => {
  var param = {
    primaryCategory: $('.main-category-select option:selected').attr('value')
  }

  if ($('.small-category-select > select').children().length) {
    $('.small-category-select > select *').remove();
    $('.small-category-select > select').append(
      `<option class='default' value=''>소분류</option>`
    )
  }

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/medicine/category/small',
    data: param,
    dataType: 'json',
    cache: false,
  }).done(result => {
    for (i in result) {
      if (i === '0') {

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

        if ($('#medicineTableBody').children().length)
          $('#medicineTableBody *').remove();

        for (var i = 0; i < tableRenderMedicine.length; i++) {
          $('#medicineTableBody').append(
            `<tr id=${tableRenderMedicine[i].id} class='pharmacopoeia-hover'>
                       <td>${tableRenderMedicine[i].name}</td>
                       <td>${tableRenderMedicine[i].ingredient}</td>
                       <td>${tableRenderMedicine[i].medication}</td>
                       <td>${tableRenderMedicine[i].property}</td>
                </tr>`
          )
        }
      }
      else {
        $('.small-category-select > select').append(
          `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
      }
    }
  });
})

$('.small-category-select').change(() => {
  var medicine = JSON.parse(window.localStorage.getItem('medicine'));
  var categoryMain = $('.main-category-select option:selected').text();
  var categorySmall = $('.small-category-select option:selected').text();
  tableRenderMedicine = [];

  medicine.find(function (x) {
    if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
      tableRenderMedicine.push(x);
    }
  });

  if ($('#medicineTableBody').children().length)
    $('#medicineTableBody *').remove();

  for (var i = 0; i < tableRenderMedicine.length; i++) {
    $('#medicineTableBody').append(
      `<tr id=${tableRenderMedicine[i].id} class='pharmacopoeia-hover'>
               <td>${tableRenderMedicine[i].name}</td>
               <td>${tableRenderMedicine[i].ingredient}</td>
               <td>${tableRenderMedicine[i].medication}</td>
               <td>${tableRenderMedicine[i].property}</td>
        </tr>`
    )
  }
})

$('.pharmacySearchButton').on('click', () => {

  // 공백일 경우 검색할 약품명 또는 성분명을 입력해주세요 alert 출력

  $('.main-category-select > select > .default').attr('selected', 'selected');
  $('.small-category-select > select > .default').attr('selected', 'selected');
  $('.main-category-select > select').nextAll('div.text').text('대분류');
  $('.small-category-select > select').nextAll('div.text').text('소분류');

  var searchText = $('input[name=medicineSearchText]').val();
  var option = $('.medicineSearchSelect option:selected').val();
  var param = {
    searchText: searchText,
    option: option
  }

  if (searchText === '') {
    alert('검색할 약품명 또는 성분명을 입력해주세요.');
    return;
  }

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/medicine/search',
    data: param,
    dataType: 'json',
    cache: false,
  }).done(result => {

    if ($('#medicineTableBody').children().length)
      $('#medicineTableBody *').remove();

    for (var i in result) {
      $('#medicineTableBody').append(
        `<tr id=${result[i].id} class='pharmacopoeia-hover'>
                 <td>${result[i].name}</td>
                 <td>${result[i].ingredient}</td>
                 <td>${result[i].medication}</td>
                 <td>${result[i].property}</td>
          </tr>`
      )
    }
  });
})

$(document).on('click', '.pharmacopoeia-hover', (e) => {

  if ($('#prescriptionTableBody .defaultPrescriptionTableBody').length)
    $('#prescriptionTableBody .defaultPrescriptionTableBody').remove();

  JSON.parse(window.localStorage.getItem('medicine')).find(function (x) {
    if (x.id === Number(e.currentTarget.id)) {
      $('#prescriptionTableBody').append(
        `<tr id=${x.id}>
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
        textHead: '[알림]',
        text: '처방전에 ' + x.name + '이(가) 추가되었습니다.',
        bgcolor: '#55a9ee',
        textcolor: '#fff',
        position: 'top-left',
        time: 2,
      })
    }
  })
})

$(document).on('click', '.deleteTargetByIcon', (e) => {
  $(e.target).parent().parent().remove();
})

function getStatus(status) {

  switch (status) {
    case 1: return '접수 완료'; break;
    case 2: return '예진 완료'; break;
    case 3: return '처방 대기'; break;
    case 4: return '약 조제중'; break;
    case 5: return '조제'; break;
  }
}

init();