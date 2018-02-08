import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';
import 'jquery-validation';

var tableRenderMedicineManagement = [];

function init() {

    if (!_.eq(location.pathname, '/management')) return;
    $('#inventory-management').hide();
    $('#history-management').hide();
    showAndHide('content-list', 'pharmacopoeia-management');
    getPharmacopoeia();
}

$('#add-medicine-form').validate({
  onkeyup:false,
  onfocusout : function(element){
      $(element).valid();
  },
  rules:{
    name:{
      required: true,
      maxlength:40
    },
    ingredient:{
      required: true,
      maxlength: 100
    },
    amount:{
      required: true,
      digits: true,
      min: 0,
      max: 999
    },
    quantity:{
      required: true,
      digits: true,
      min: 0,
      max: 999
    },
    property:{
      maxlength: 255
    },
    medication:{
      maxlength: 255
    }
  },
  messages:{
    name:{
      required: "약품명을 입력해 주세요",
      maxlength: "약품명은 최대 40자까지 입력 가능합니다"
    },
    ingredient:{
      required: "성분명 및 함량을 입력해 주세요",
      maxlength: "성분명 및 함량은 최대 100자까지 입력 가능합니다"
    },
    amount:{
      required: "통당 약정 수를 입력해 주세요",
      digits: "약정 수를 정수 형식으로 입력해 주세요",
      min: "재고량은 0 이상의 수만 입력 가능합니다",
      max: "재고량은 최대 999까지 입력 가능합니다"
    },
    quantity:{
      required: "재고량을 입력해 주세요",
      digits: "재고량을 정수 형식으로 입력해 주세요",
      min: "재고량은 0 이상의 수만 입력 가능합니다",
      max: "재고량은 최대 999까지 입력 가능합니다"
    },
    property:{
      maxlength: "약효는 최대 255자까지 입력 가능합니다"
    },
    medication:{
      maxlength: "용량/용법은 최대 255자까지 입력 가능합니다"
    }
  },
  showErrors:function(errorMap, errorList){
      if(this.numberOfInvalids()) {
          $.uiAlert({
              textHead: '[경고]',
              text: errorList[0].message,
              bgcolor: '#FF5A5A',
              textcolor: '#fff',
              position: 'top-center',
              time: 2
          });
          errorList[0].element.focus();
      }
  }
});

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
                       <td><input type="checkbox" name="checkMedicine" value="${tableRenderMedicineManagement[i].id}"/></td>
                       <td>${tableRenderMedicineManagement[i].primaryCategory}</td>
                       <td>${tableRenderMedicineManagement[i].secondaryCategory}</td>
                       <td>${tableRenderMedicineManagement[i].name}</td>
                       <td>${tableRenderMedicineManagement[i].ingredient}</td>
                       <td>${tableRenderMedicineManagement[i].amount}</td>
                       <td>${tableRenderMedicineManagement[i].quantity}</td>
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
          <td><input type="checkbox" name="checkMedicine" value="${tableRenderMedicineManagement[i].id}"/></td>
          <td>${tableRenderMedicineManagement[i].primaryCategory}</td>
          <td>${tableRenderMedicineManagement[i].secondaryCategory}</td>
          <td>${tableRenderMedicineManagement[i].name}</td>
          <td>${tableRenderMedicineManagement[i].ingredient}</td>
          <td>${tableRenderMedicineManagement[i].amount}</td>
          <td>${tableRenderMedicineManagement[i].quantity}</td>
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
            <td><input type="checkbox" name="checkMedicine" value="${result[i].id}"/></td>
            <td>${result[i].primaryCategory}</td>
            <td>${result[i].secondaryCategory}</td>
            <td>${result[i].name}</td>
            <td>${result[i].ingredient}</td>
            <td>${result[i].amount}</td>
            <td>${result[i].quantity}</td>
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

/**
  * 약품 추가 클릭시
  */
  var add_main_category_value='';
  var add_small_category_value='';

$('.add-medicine-by-management').on('click', () => {

    if ($('.main-category-select2 > select').children().length) {
        $('.main-category-select2 > select *').remove();
        $('.main-category-select2 > select').append(
            `<option class='' value=''>대분류</option>`
        )
    }

    if ($('.small-category-select2 > select').children().length) {
        $('.small-category-select2 > select *').remove();
        $('.small-category-select2 > select').append(
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
        $('.main-category-select2 > select').append(
            _.map(results, result => `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`)
        );
    });

    $('.ui.longer.modal.pharmacopoeia-add').modal('show')
    $('.dropdown').dropdown()
});

$('.main-category-select2').change(() => {
  add_main_category_value = $('.main-category-select2 option:selected').attr('value');
  var param = {
    primaryCategory: add_main_category_value
  }

  if ($('.small-category-select2 > select').children().length) {
    $('.small-category-select2 > select *').remove();
    $('.small-category-select2 > select').append(
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
    console.log(result);
    for (var i in result) {
      if (i === '0') {
        $('.small-category-select2 > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

        $('.small-category-select2 > select').append(
          `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
        add_small_category_value = `${result[i].secondaryCategory}`;
      }
      else {
        $('.small-category-select2 > select').append(
          `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
      }
    }
  });
})

$('.small-category-select2').change(() => {
  add_small_category_value = $('.small-category-select2 option:selected').attr('value');
  alert(add_small_category_value);
});

$('#add-medicine-btn').click(function(){
    if(!$('#add-medicine-form').valid()) return false;

    if(!add_main_category_value || add_main_category_value === ""){
      $.uiAlert({
        textHead: '[경고]',
        text: '대분류를 선택해주세요!',
        bgcolor: '#FF5A5A',
        textcolor: '#fff',
        position: 'top-left',
        time: 2,
      });

      return false;
    }
    if(!add_small_category_value || add_small_category_value === ""){
      $.uiAlert({
        textHead: '[경고]',
        text: '소분류를 선택해주세요!',
        bgcolor: '#FF5A5A',
        textcolor: '#fff',
        position: 'top-left',
        time: 2,
      });

      return false;
    }

    let docs = {};
    let v = $('#add-medicine-form').serializeArray();
    for(var i in v){
      docs[v[i].name] = v[i].value;
    }
    docs["primaryCategory"] = add_main_category_value;
    docs["secondaryCategory"] = add_small_category_value;
// alert(JSON.stringify(docs));
    insertMedicine(docs);

});


function insertMedicine (data) {
    http
      .postMethod(`/medicine/insert`, data)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`insert fail new medicine data ${data.error}`);
          }

          return Promise.resolve(data);
      })
      .then(function(){
        console.log('나니');
        $.uiAlert({
          textHead: '[알림]',
          text: '약정보 추가 완료',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        });
      })
      .catch(error => {
        console.log(error);
        $.uiAlert({
          textHead: '[ERROR-CODE 7008]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        });
      });
}

//약 일괄삭제
$('.delete-medicine-by-management').on('click', () => {
  let medicineIds = [];
  $(":checkbox[name='checkMedicine']:checked").each(function() {
    medicineIds.push($(this).val());
  });

  // alert(JSON.stringify(medicineIds));
  let target = {"medicineIds" : JSON.stringify(medicineIds)};
  openConfirmModal(target, { confirmMessage: '선택한 약들을 일괄 삭제 삭제하시겠습니까?' }, deleteMedicines);
});

function deleteMedicines (data) {
    http
      .postMethod(`/medicine/delete`, data)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`delete fail medicine data ${data.error}`);
          }

          return Promise.resolve(data);
      })
      .then(function(){
        console.log('나니');
        $.uiAlert({
          textHead: '[알림]',
          text: '약정보 일괄 삭제 완료',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-center',
          time: 2,
        });
        location.reload();
      })
      .catch(error => {
        console.log(error);
        $.uiAlert({
          textHead: '[ERROR-CODE 7008]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        });
      });
}

function openConfirmModal (target, message, gotoFunction) {

  $('.ui.mini.modal').modal({
    closable: false,
    onShow: () => {
      $('.confirm-modal-wrap > .content > p').empty();
      $('.confirm-modal-wrap > .content > p').text(message.confirmMessage);
    },
    onApprove: () => {
      gotoFunction(target)
    }
  }).modal('show')
}

init();
