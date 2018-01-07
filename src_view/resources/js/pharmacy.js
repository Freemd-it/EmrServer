import $ from 'jquery';
import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';

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


}

$(document).ready(() => {

  getPharmacyOcsData('now');

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
});


$('.medicineSearchSelect').change(() => {

  var sourceTarget;

  if ($('.medicineSearchSelect option:selected').val() === '1') {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
  } else {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
  }
  $('.search.ui').search({ source: sourceTarget })
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
               <td width="10%">
                 <select class="doses-for-day">
                    <option selected value="qd">qd</option>
                    <option value="bid">bid</option>
                    <option value="tid">tid</option>
                    <option value="hs">hs</option>
                 </select>
               </td>
               <td><input /></td>
               <td><input /></td>
               <td class="deletePrescriptionTD">
                <i class="sign out icon delete-icon-size deleteTargetByIcon"></i>
               </td>
         </tr>`
      )

      $('.doses-for-day').addClass('ui search fluid dropdown');
      $('.doses-for-day.dropdown').dropdown();

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
    case 3: return '조제 대기'; break;
    case 4: return '조제중'; break;
    case 5: return '처방 대기'; break;
  }
}

function getStatusClass(status) {

  switch (status) {
    case 3: return 'ocs-hover negative'; break;
    case 4: return 'ocs-hover warning'; break;
    case 5: return 'ocs-hover positive'; break;
    default : return 'selectable'; break;
  }
}

function getPharmacyOcsData(nowData = "now", page = 1) {

    if ($('#PharmacyOCSTableBody').children().length)
      $('#PharmacyOCSTableBody *').remove();
    $('.pharmacy-ocs-table').empty();

    http
        .getMethod(`/waitingList/pharmacy/${nowData}/${page}`)
        .then(result => {
            const { data, code } = result;
            data.nowData = nowData;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject(`fail pharmacy ocs data ${data.error}`);
            }
            return Promise.resolve(data);
        })
        .then(pharmacyOcsTableDataSetting)
        .catch(error => console.log(error))
}

window.getPharmacyOcsData = getPharmacyOcsData;

function pharmacyOcsTableDataSetting(result) {

  const { endPage, startPage, totalPage, max,
      page, pageSize, datas, nowData } = result;
  const footEle = [];

  $('#PharmacyOCSTableBody').append(
      _.map(datas, data => {
          const { chartNumber, name, status } = data;
          return ` <tr attr="${chartNumber}" class="${getStatusClass(status)}">
              <td>${chartNumber}</td>
              <td>${name}</td>
              <td>${getStatus(status)}</td>
          </tr>`
      })
  );

  if (page <= pageSize) {
      footEle.push(`
      <a class="icon item pharmacy-ocs-paging" style="text-decoreation:none" onclick="javascript:getPharmacyOcsData('${nowData}',${startPage === page ? startPage : (page - 1)})">
          <i class="left chevron icon"></i>
      </a>`)
  } else {
      footEle.push(`
      <a class="icon item">
          <i class="left chevron icon"></i>
      </a>`)
  }

  footEle.push(_.map(_.range(startPage, endPage + 1), (num) => {

      if (_.eq(num, page)) {
          return `<a class="item">${num}</a>`
      } else {
          return `<a class="item pharmacy-ocs-paging" style="text-decoreation:none" onclick="javascript:getPharmacyOcsData('${nowData}',${num})">${num}</a>`

      }
  }))

  if (endPage <= totalPage) {
      footEle.push(`
      <a class="icon item pharmacy-ocs-paging"  style="text-decoreation:none"  onclick="javascript:getPharmacyOcsData('${nowData}',${endPage === page ? endPage : (page + 1)})">
        <i class="right chevron icon"></i>
      </a>`)
  } else {
      footEle.push(`
      <a class="icon item">
        <i class="right chevron icon"></i>
      </a>`)
  }
  $('.pharmacy-ocs-table').append(_.flatten(footEle));
}

$('.getPharmacyOCS').on('click', () => {

  getPharmacyOcsData('now');
});

$('#PharmacyOCSTableBody').on('click', (e) => {

  const chartNumber = $(e.target.parentNode).attr('attr');
  getPrescription(chartNumber);
});

function getPrescription(chartNumber) {

  $('.prescription-table-body').empty();

  http
      .getMethod(`/prescription/${chartNumber}`)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`fail ocs data ${data.error}`);
          }
          return Promise.resolve(data);
      })
      .then(prescriptionDataSetting)
      .catch(error => console.log(error))
}

function prescriptionDataSetting(data) {

  const { prescriptions, chartNumber, name = data.patient.name, impression, presentIllness, treatmentNote } = data;

  if (prescriptions.length === 0) {
    $('.prescription-table-body').append(
      `<tr>
          <td class="defaultPrescriptionTableBody" style="text-align:center;" colspan="7">처방된 약이 없습니다. 본진 보조에게 먼저 문의해본 후 IT 본부 단원을 찾아주세요.</td>
      </tr>`
    )
  } else {
    $('.prescription-table-body').append(
        _.map(prescriptions, data => {
          const { medicineName, medicineIngredient, doses, dosesCountByDay, dosesDay, remarks } = data;
          return ` <tr class="ui fluid">
            <td>${medicineName}</td>
            <td>${medicineIngredient}</td>
            <td>${doses}</td>
            <td>${dosesCountByDay}</td>
            <td>${dosesDay}</td>
            <td>${remarks === '' ? '-' : remarks}</td>
            <td>
              <i class="configure link icon"></i>
              <i class="trash link icon"></i>
            </td>
          </tr>`
        })
    );
  }

  $('#pharmacy-chart-id').val(chartNumber);
  $('#pharmacy-chart-name').val(name);
  $('.pharmacy-impression').val(impression.replace(/<br>/g, "\r\n"));
  $('.pharmacy-present-illness').val(presentIllness.replace(/<br>/g, "\r\n"));
  $('.pharmacy-treatment-note').val(treatmentNote.replace(/<br>/g, "\r\n"));

}

init();
