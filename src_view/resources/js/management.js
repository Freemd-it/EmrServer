import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';

var tableRenderMedicineManagement = [];

function init() {

    if (!_.eq(location.pathname, '/management')) return;
    $('#inventory-management').hide();
    $('#history-management').hide();
    showAndHide('content-list', 'pharmacopoeia-management');
    getPharmacopoeia();
}

$('.tab-menu-list > .item').on('click', (e) => {

  $('.tab-menu-list').children().removeClass('active');
  $(e.target).addClass('active');
  showAndHide('content-list', $(e.target).attr('id').split('-tab')[0])
});

function showAndHide (rowsClass, newId) {

    const rows = $(`.${rowsClass}`);
    const findRow = _.find(rows, row => $(row).is(':visible'));
    const { id: findId = "" } = findRow;
    if (!_.eq(findId, newId)) {
        $(`.${rowsClass}`).hide()
        $(`#${newId}`).show()
    }
}

function getPharmacopoeia () {

    if ($('.management-main-category-select > select').children().length) {
        $('.management-main-category-select > select *').remove();
        $('.management-main-category-select > select').append(
            `<option class='' value=''>대분류</option>`
        )
    }

    if ($('.management-small-category-select > select').children().length) {
        $('.management-small-category-select > select *').remove();
        $('.management-small-category-select > select').append(
            `<option class='default' value=''>소분류</option>`
        )
    }

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/category/main',
        dataType: 'json',
        cache: false,
    }).done(results => {
        /**
         * 데이터 추가 후 modal
         */
        $('.management-main-category-select > select').append(
            _.map(results, result => `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`)
        );
    });

    $('.dropdown').dropdown()
}

$('.management-main-category-select').change(() => {
  var param = {
    primaryCategory: $('.management-main-category-select option:selected').attr('value')
  }

  if ($('.management-small-category-select > select').children().length) {
    $('.management-small-category-select > select *').remove();
    $('.management-small-category-select > select').append(
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

        $('.management-small-category-select > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

        $('.management-small-category-select > select').append(
          `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
        var medicine = JSON.parse(window.localStorage.getItem('medicine'));
        var categoryMain = $('.management-main-category-select option:selected').text();
        var categorySmall = $('.management-small-category-select option:selected').text();
        tableRenderMedicineManagement = [];

        medicine.find(function (x) {
          if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
            tableRenderMedicineManagement.push(x);
          }
        });

        if ($('#medicine-management-table-body').children().length)
          $('#medicine-management-table-body *').remove();

        for (var i = 0; i < tableRenderMedicineManagement.length; i++) {
          $('#medicine-management-table-body').append(
            `<tr id=${tableRenderMedicineManagement[i].id}>
                       <td><input type="checkbox" /></td>
                       <td>${tableRenderMedicineManagement[i].primaryCategory}</td>
                       <td>${tableRenderMedicineManagement[i].secondaryCategory}</td>
                       <td>${tableRenderMedicineManagement[i].name}</td>
                       <td>${tableRenderMedicineManagement[i].ingredient}</td>
                       <td>${tableRenderMedicineManagement[i].amount}</td>
                       <td>${tableRenderMedicineManagement[i].medication}</td>
                       <td>${tableRenderMedicineManagement[i].property}</td>
                       <td>
                         <i class="configure-medicine-by-management configure link icon"></i>
                         <i class="delete-medicine-by-management trash link icon"></i>
                       </td>
                </tr>`
          )
        }
      }
      else {
        $('.management-small-category-select > select').append(
          `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
      }
    }
  });
})

$('.management-small-category-select').change(() => {

  var medicine = JSON.parse(window.localStorage.getItem('medicine'));
  var categoryMain = $('.management-main-category-select option:selected').text();
  var categorySmall = $('.management-small-category-select option:selected').text();
  tableRenderMedicineManagement = [];

  medicine.find(function (x) {
    if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
      tableRenderMedicineManagement.push(x);
    }
  });

  if ($('#medicine-management-table-body').children().length)
    $('#medicine-management-table-body *').remove();

  for (var i = 0; i < tableRenderMedicineManagement.length; i++) {
    $('#medicine-management-table-body').append(
      `<tr id=${tableRenderMedicineManagement[i].id}>
          <td><input type="checkbox" /></td>
          <td>${tableRenderMedicineManagement[i].primaryCategory}</td>
          <td>${tableRenderMedicineManagement[i].secondaryCategory}</td>
          <td>${tableRenderMedicineManagement[i].name}</td>
          <td>${tableRenderMedicineManagement[i].ingredient}</td>
          <td>${tableRenderMedicineManagement[i].amount}</td>
          <td>${tableRenderMedicineManagement[i].medication}</td>
          <td>${tableRenderMedicineManagement[i].property}</td>
          <td>
            <i class="configure-medicine-by-management configure link icon"></i>
            <i class="delete-medicine-by-management trash link icon"></i>
          </td>
      </tr>`
    )
  }
})

$('.management-pharmacy-search-button').on('click', () => {

  // 공백일 경우 검색할 약품명 또는 성분명을 입력해주세요 alert 출력

  $('.management-main-category-select > select > .default').attr('selected', 'selected');
  $('.management-small-category-select > select > .default').attr('selected', 'selected');
  $('.management-main-category-select > select').nextAll('div.text').text('대분류');
  $('.management-small-category-select > select').nextAll('div.text').text('소분류');

  var searchText = $('input[name=managementMedicineSearchText]').val();
  var option = $('.management-medicine-search-select option:selected').val();
  var param = {
    searchText: searchText,
    option: option
  }

  if (searchText === '' || typeof searchText === 'undefined') {
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

    if ($('#medicine-management-table-body').children().length)
      $('#medicine-management-table-body *').remove();

    for (var i in result) {
      $('#medicine-management-table-body').append(
        `<tr id=${result[i].id}>
            <td><input type="checkbox" /></td>
            <td>${result[i].primaryCategory}</td>
            <td>${result[i].secondaryCategory}</td>
            <td>${result[i].name}</td>
            <td>${result[i].ingredient}</td>
            <td>${result[i].amount}</td>
            <td>${result[i].medication}</td>
            <td>${result[i].property}</td>
            <td>
              <i class="configure-medicine-by-management configure link icon"></i>
              <i class="delete-medicine-by-management trash link icon"></i>
            </td>
          </tr>`
      )
    }
  });
});

$('.management-medicine-search-select').change(() => {

  var sourceTarget;
  $('.search.ui').search({ source: [] })

  if ($('.management-medicine-search-select option:selected').val() === '1') {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
  } else {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
  }
  console.log(sourceTarget);
  $('.search.ui').search({ source: sourceTarget })
});

init();
