import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';
import 'jquery-validation';

var tableRenderMedicineInventory = [];

function getPharmacopoeia () {

    if ($('.inventory-main-category-select > select').children().length) {
        $('.inventory-main-category-select > select *').remove();
        $('.inventory-main-category-select > select').append(
            `<option class='' value=''>대분류</option>`
        )
    }

    if ($('.inventory-small-category-select > select').children().length) {
        $('.inventory-small-category-select > select *').remove();
        $('.inventory-small-category-select > select').append(
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
        $('.inventory-main-category-select > select').append(
            _.map(results, result => `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`)
        );
    });

    $('.dropdown').dropdown()
}

getPharmacopoeia();

//재고표 수정시 유효성 검사 (총량 여기서 해주자)
$('#medicine-inventory-form').validate({
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
    capacity:{
      maxlength: 45
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
    expiry: {
      required: true,
      dateISO: true
    },
    totalAmount:{
      min: element => $('#amount').val() * $('#quantity').val()
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
    capacity:{
      maxlength: "용량은 최대 45자까지 입력 가능합니다"
    },
    amount:{
      required: "약품 1통당 개수를 입력해 주세요",
      digits: "약품 1통당 개수를 0 이상의 정수로 입력해 주세요",
      max: "약품 1통당 개수는 최대 999까지 입력 가능합니다"
    },
    quantity:{
      required: "재고량을 입력해 주세요",
      digits: "재고량을 0 이상의 정수로 입력해 주세요",
      max: "재고량은 최대 999까지 입력 가능합니다"
    },
    expiry:{
      required: "유효기간을 정확히 입력해주세요 ^0^",
      dateISO: "유효기간을 정확히 입력해주세요"
    },
    totalAmount:{
      min: "총량이 재고수보다 적습니다. 총량 및 재고를 확인해주세요"
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


var management_main_category_value = '';
var management_small_category_value = '';
$('.inventory-main-category-select').change(() => {
  management_main_category_value = $('.inventory-main-category-select option:selected').attr('value');
  var param = {
    primaryCategory: management_main_category_value
  }

  if ($('.inventory-small-category-select > select').children().length) {
    $('.inventory-small-category-select > select *').remove();
    $('.inventory-small-category-select > select').append(
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
    for (var i in result) {
      if (i === '0') {

        $('.inventory-small-category-select > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

        $('.inventory-small-category-select > select').append(
          `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
        var medicine = JSON.parse(window.localStorage.getItem('medicine'));
        var categoryMain = $('.inventory-main-category-select option:selected').text();
        var categorySmall = $('.inventory-small-category-select option:selected').text();
        tableRenderMedicineInventory = [];

        medicine.find(function (x) {
          if ($.trim(x.primaryCategory) === $.trim(categoryMain) && $.trim(x.secondaryCategory) === $.trim(categorySmall)) {
            tableRenderMedicineInventory.push(x);
          }
        });

        if ($('#medicine-inventory-table').children().length)
          $('#medicine-inventory-table-body *').remove();

        setMedicineTableBody(tableRenderMedicineInventory);
      }
      else {
        $('.inventory-small-category-select > select').append(
          `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
        )
      }
    }
  });
})

$('.inventory-small-category-select').change(() => {

  var medicine = JSON.parse(window.localStorage.getItem('medicine'));
  management_main_category_value = $('.inventory-main-category-select option:selected').text();
  management_small_category_value = $('.inventory-small-category-select option:selected').text();
  tableRenderMedicineInventory = [];

  medicine.find(function (x) {
    if ($.trim(x.primaryCategory) === $.trim(management_main_category_value) && $.trim(x.secondaryCategory) === $.trim(management_small_category_value)) {
      tableRenderMedicineInventory.push(x);
    }
  });

  if ($('#medicine-inventory-table-body').children().length)
    $('#medicine-inventory-table-body *').remove();

  setMedicineTableBody(tableRenderMedicineInventory);
})

$('.inventory-pharmacy-search-button').on('click', () => {

  // 공백일 경우 검색할 약품명 또는 성분명을 입력해주세요 alert 출력

  $('.inventory-main-category-select > select > .default').attr('selected', 'selected');
  $('.inventory-small-category-select > select > .default').attr('selected', 'selected');
  $('.inventory-main-category-select > select').nextAll('div.text').text('대분류');
  $('.inventory-small-category-select > select').nextAll('div.text').text('소분류');

  var searchText = $('input[name=inventoryMedicineSearchText]').val();
  var option = $('.inventory-medicine-search-select option:selected').val();
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

    if ($('#medicine-inventory-table-body').children().length)
      $('#medicine-inventory-table-body *').remove();

    setMedicineTableBody(result);
  });
});

function setMedicineTableBody(datas){
  $('#medicine-inventory-table-body').append(
      _.map(datas, data => {
          const { id, primaryCategory, secondaryCategory, name, ingredient, amount, quantity, available, memo, expiry, totalAmount, capacity } = data;
          return `<tr id=${id} class="ui fluid">
              <td style="overflow:visible;">${primaryCategory}</td>
              <td style="overflow:visible;">${secondaryCategory}</td>
              <td>${name}</td>
              <td>${ingredient}</td>
              <td>${capacity ? capacity : ''}</td>
              <td>${amount}</td>
              <td>${expiry ? expiry : ''}</td>
              <td>${quantity}</td>
              <td>${totalAmount}</td>
              <td>${memo ? memo : ''}</td>
              <td>
                <i class="configure-medicine-by-inventory configure link icon"></i>
                <i class="delete-medicine-by-inventory trash link icon"></i>
              </td>
            </tr>`
      })
  );
}

$('.inventory-medicine-search-select').change(() => {

  var sourceTarget;
  $('.search.ui').search({ source: [] })

  if ($('.inventory-medicine-search-select option:selected').val() === '1') {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
  } else {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
  }
  $('.search.ui').search({ source: sourceTarget })
});

$(document).on('click', '.cancel-update-inventory', (e) => {
  const target = $(e.target).parent().parent();
  let id = target.attr('id');
  let medicines = JSON.parse(window.localStorage.getItem('medicine'));
  cancelUpdateMedicineInventory(target, _.filter(medicines, ['id', parseInt(id)])[0]);
});

function cancelUpdateMedicineInventory(target, data) {
  const { name, ingredient, amount, expiry, quantity, totalAmount, memo, capacity } = data;
  console.table(data);
  target.children().eq(2).empty().append(name)
  target.children().eq(3).empty().append(ingredient)
  target.children().eq(4).empty().append(capacity)
  target.children().eq(5).empty().append(amount)
  target.children().eq(6).empty().append(expiry)
  target.children().eq(7).empty().append(quantity)
  target.children().eq(8).empty().append(totalAmount)
  target.children().eq(9).empty().append(memo)

  target.children().eq(10).empty().append(`
    <i class="configure-medicine-by-inventory configure link icon"></i>
    <i class="delete-medicine-by-management trash link icon"></i>`)
}


/**
  * 약품 정보 수정
  */
$(document).on('click', '.configure-medicine-by-inventory', (e) => {
    const target = $(e.target).parent().parent();
    const name = target.children().eq(2).text()
    const ingredient = target.children().eq(3).text()
    const capacity = target.children().eq(4).text()
    const amount = target.children().eq(5).text()
    const expiry =  target.children().eq(6).text()
    const quantity = target.children().eq(7).text()
    const totalAmount = target.children().eq(8).text()
    const memo = target.children().eq(9).text()

    target.children().eq(2).empty().append(`<input value="${name}" name="name" />`)
    target.children().eq(3).empty().append(`<input value="${ingredient}" name="ingredient" />`)
    target.children().eq(4).empty().append(`<input value="${capacity}" name="capacity"  />`)
    target.children().eq(5).empty().append(`<input value="${amount}" name="amount" id="amount" />`)
    target.children().eq(6).empty().append(`<input type="date" name="expiry" value="${expiry}"/>`)
    target.children().eq(7).empty().append(`<input type="text" value="${quantity}" name="quantity" id="quantity" />`)
    target.children().eq(8).empty().append(`<input value="${totalAmount}" name="totalAmount"  />`)
    target.children().eq(9).empty().append(`<textarea name="memo" style="resize: none; overflow-x:hidden;">${memo}</textarea>`)

    target.children().eq(10).empty().append(`
      <a class="update-medicine-in-inventory">수정완료</a><br />
      <a class="cancel-update-inventory">수정취소</a>
      `)

});


//수정완료
$(document).on('click', '.update-medicine-in-inventory', (e) => {
  if(!$('#medicine-inventory-form').valid()) return;

  const target = $(e.target).parent().parent();
  openConfirmModal(target, { confirmMessage: '약 정보 수정을 완료하시겠습니까?' }, updateMedicineInManagement);
});

function updateMedicineInManagement(target){
  let id = target.attr('id');
  let docs = {};

  docs.id = id;
  let v = $('#medicine-inventory-form').serializeArray();
  for(var i in v){
    docs[v[i].name] = v[i].value;
  }
  // if(docs.totalAmount < (docs.quantity * docs.amount)){
  //   $.uiAlert({
  //       textHead: '[경고]',
  //       text: "총량이 재고 수보다 적습니다. 재고 및 총량의 개수를 확인해주세요!",
  //       bgcolor: '#FF5A5A',
  //       textcolor: '#fff',
  //       position: 'top-center',
  //       time: 2
  //   });
  //   return false;
  // }
   // $('.small-category-select3 option:selected').attr('value');
  console.table(docs);
  http
    .postMethod(`/medicine/update`, docs)
    .then(result => {
        const { data, code } = result;

        if (!_.eq(code, resultCode.success)) {
            return Promise.reject(`update fail medicine data ${data.error}`);
        }

        return Promise.resolve(data);
    })
    .then(function(){
      console.log('나니');
      $.uiAlert({
        textHead: '[알림]',
        text:  docs.name + ' 정보 수정 완료',
        bgcolor: '#55a9ee',
        textcolor: '#fff',
        position: 'top-left',
        time: 2,
      });
      updateLocalStorage(function(target){
        let id = target.attr('id');
        let medicines = JSON.parse(window.localStorage.getItem('medicine'));
        cancelUpdateMedicineInventory(target, _.filter(medicines, ['id', parseInt(id)])[0]);
      }, target);
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


$(document).on('click', '.delete-medicine-by-inventory', (e) => {
  const medicineId = [];
  medicineId.push($(e.target).parent().parent().attr('id'));
  let name = $(e.target).parent().parent().children().eq(3).text()
  let target = {"medicineIds" : JSON.stringify(medicineId) };
  openConfirmModal(target, { confirmMessage: `'${name}'을(를) 삭제하시겠습니까?` }, deleteMedicine);
});

function deleteMedicine (data) {
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
        let ids = JSON.parse(data.medicineIds);
        $('#'+ids[0]).remove();


        $.uiAlert({
          textHead: '[알림]',
          text: '약정보 삭제 완료',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-center',
          time: 2,
        });

        updateLocalStorage();

      })
      .catch(error => {
        console.log(error);
        $.uiAlert({
          textHead: '[ERROR-CODE 7010]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        });
      });
}

$('#select-all-inventory-button').click(function(){
  $("#inventory-main-category-select").val('').prop("selected", true);
  $("#inventory-small-category-select").val('').prop("selected", true);

  let medicines = JSON.parse(window.localStorage.getItem('medicine'));

  if ($('#medicine-inventory-table-body').children().length)
    $('#medicine-inventory-table-body *').remove();

  setMedicineTableBody(medicines);

  $.uiAlert({
    textHead: '[알림]',
    text: ' 전체 약품 재고가 조회되었습니다 ',
    bgcolor: '#55a9ee',
    textcolor: '#fff',
    position: 'top-left',
    time: 2,
  });
})

function updateLocalStorage(callback, target){
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/medicine/list/management',
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
    if(callback){
      callback(target);
    }
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
