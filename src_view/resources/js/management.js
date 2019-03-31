import _ from 'lodash';
import queryString from 'query-string';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';
import 'jquery-validation';
import exportFunc from '../utils/excel';

(function () {
  let tableRenderMedicineManagement = [];
  // 선택 된 검색 목록 ( excel 다운로드 할 경우 )
  const selectedCondition = {};
  const SEARCH_OPTIONS = ['', 'name', 'ingredient'];
  selectedCondition.categoryMain = '';
  selectedCondition.categorySmall = '';
  selectedCondition.searchSet = SEARCH_OPTIONS[1]; // 검색 조건
  selectedCondition.searchText = '';

  // 입력이 변경 될때 마다 / 검색 조건 초기화
  $('input[name=managementMedicineSearchText]').change(() => {
    selectedCondition.searchText = '';
  });

  function init() {
    if (!location.pathname.includes('/management')) return;
    $('#inventory-management').hide();
    $('#history-management').hide();
    showAndHide('content-list', 'pharmacopoeia-management');
    if (window.location.pathname === '/management') getPharmacopoeia();
  }

  function setValidate(formId) {
    $(formId).validate({
      onkeyup: false,
      onfocusout: false,
      rules: {
        name: {
          required: true,
          maxlength: 40
        },
        ingredient: {
          required: true,
          maxlength: 100
        },
        amount: {
          required: true,
          number: true,
          min: 1,
          max: 9999
        },
        quantity: {
          required: true,
          number: true,
          min: 0,
          max: 9999
        },
        property: {
          maxlength: 255
        },
        medication: {
          maxlength: 255
        }
      },
      messages: {
        name: {
          required: "약품명을 입력해 주세요",
          maxlength: "약품명은 최대 40자까지 입력 가능합니다"
        },
        ingredient: {
          required: "성분명 및 함량을 입력해 주세요",
          maxlength: "성분명 및 함량은 최대 100자까지 입력 가능합니다"
        },
        amount: {
          required: "약품 1통당 개수를 입력해 주세요",
          numbers: "약품 1통당 개수를 0 이상의 정수로 입력해 주세요",
          min: "약품 1통당 개수를 1 이상의 정수로 입력해 주세요",
          max: "약품 1통당 개수는 최대 9999까지 입력 가능합니다"
        },
        quantity: {
          required: "재고량을 입력해 주세요",
          numbers: "재고량을 0 이상의 정수로 입력해 주세요",
          max: "재고량은 최대 9999까지 입력 가능합니다"
        },
        property: {
          maxlength: "약효는 최대 255자까지 입력 가능합니다"
        },
        medication: {
          maxlength: "용량/용법은 최대 255자까지 입력 가능합니다"
        }
      },
      showErrors: function (errorMap, errorList) {
        if (this.numberOfInvalids()) {
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
  }

  setValidate('#add-medicine-form');
  setValidate('#medicine-management-form');

  $('.tab-menu-list > .item').on('click', (e) => {

    $('.tab-menu-list').children().removeClass('active');
    $(e.target).addClass('active');
    showAndHide('content-list', $(e.target).attr('id').split('-tab')[0])
  });

  function showAndHide(rowsClass, newId) {

    const rows = $(`.${rowsClass}`);
    const findRow = _.find(rows, row => $(row).is(':visible'));
    const { id: findId = "" } = findRow;
    if (!_.eq(findId, newId)) {
      $(`.${rowsClass}`).hide()
      $(`#${newId}`).show()
    }
  }

  function getPharmacopoeia() {

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
      url: '/medicine/category/main',
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
      primaryCategory: $.trim($('.management-main-category-select option:selected').text())
    }

    if ($('.management-small-category-select > select').children().length) {
      $('.management-small-category-select > select *').remove();
      $('.management-small-category-select > select').append(
        `<option class='default' value=''>소분류</option>`
      )
    }

    $.ajax({
      type: 'GET',
      url: '/medicine/category/small',
      data: param,
      dataType: 'json',
      cache: false,
    }).done(result => {
      for (var i in result) {
        if (i === '0') {

          $('.management-small-category-select > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

          $('.management-small-category-select > select').append(
            `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
          )
          const medicine = JSON.parse(window.localStorage.getItem('medicine'));
          const categoryMain = $('.management-main-category-select option:selected').text();
          const categorySmall = $('.management-small-category-select option:selected').text();
          tableRenderMedicineManagement = [];

          // excel download 검색 조건 추가
          selectedCondition.categoryMain = categoryMain ? categoryMain : '';
          selectedCondition.categorySmall = categorySmall ? categorySmall : '';
          selectedCondition.searchText = '';

          tableRenderMedicineManagement = medicine.filter(x => $.trim(x.primaryCategory) === $.trim(categoryMain) 
            && $.trim(x.secondaryCategory) === $.trim(categorySmall));

          if ($('#medicine-management-table-body').children().length)
            $('#medicine-management-table-body *').remove();

          setMedicineTableBody(tableRenderMedicineManagement);
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
    const categoryMain = $('.management-main-category-select option:selected').text();
    const categorySmall = $('.management-small-category-select option:selected').text();
    tableRenderMedicineManagement = [];

    // excel download 검색 조건 추가
    selectedCondition.categoryMain = categoryMain ? categoryMain : ''
    selectedCondition.categorySmall = categorySmall ? categoryMain : ''
    selectedCondition.searchText = '';
    tableRenderMedicineManagement = medicine.filter(x => $.trim(x.primaryCategory) === $.trim(categoryMain) 
      && $.trim(x.secondaryCategory) === $.trim(categorySmall));
    if ($('#medicine-management-table-body').children().length) {
      $('#medicine-management-table-body *').remove();
    }

    setMedicineTableBody(tableRenderMedicineManagement);
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

    // 검색 조건 추가
    selectedCondition.searchText = searchText;
    selectedCondition.searchSet = SEARCH_OPTIONS[option];
    selectedCondition.categoryMain = '';
    selectedCondition.categorySmall = '';

    $.ajax({
      type: 'GET',
      url: '/medicine/search',
      data: param,
      dataType: 'json',
      cache: false,
    }).done(result => {

      if ($('#medicine-management-table-body').children().length)
        $('#medicine-management-table-body *').remove();

      setMedicineTableBody(result);
    });
  });

  function setMedicineTableBody(datas) {
    $('#medicine-management-table-body').append(
      _.map(datas, data => {
        const { id, primaryCategory, secondaryCategory, name, ingredient, amount, quantity, medication, property, available } = data;
        return `<tr id=${id} class="ui fluid">
                <td><input type="checkbox" name="checkMedicine" value="${id}"/></td>
                <td style="overflow:visible;">${primaryCategory}</td>
                <td style="overflow:visible;">${secondaryCategory}</td>
                <td>${name}</td>
                <td>${ingredient}</td>
                <td>${amount}</td>
                <td>${quantity}</td>
                <td>${medication}</td>
                <td>${property}</td>
                <td style="overflow:visible;">${available == "1" ? "활성" : "비활성"}</td>
                <td>
                  <i class="configure-medicine-by-management configure link icon"></i>
                  <i class="delete-medicine-by-management trash link icon"></i>
                </td>
              </tr>`
      })
    );
  }

  $('.management-medicine-search-select').change(() => {

    var sourceTarget;
    $('.search.ui').search({ source: [] })

    if ($('.management-medicine-search-select option:selected').val() === '1') {
      sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
    } else {
      sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
    }
    $('.search.ui').search({ source: sourceTarget })
  });


  /**
    * 약품 정보 수정
    */
  let update_main_category_value = '';
  let update_small_category_value = '';
  let change_category = 0;
  $(document).on('click', '.configure-medicine-by-management', (e) => {
    const target = $(e.target).parent().parent();
    const primaryCategory = target.children().eq(1).text()
    const secondaryCategory = target.children().eq(2).text()
    const name = target.children().eq(3).text()
    const ingredient = target.children().eq(4).text()
    const amount = target.children().eq(5).text()
    const quantity = target.children().eq(6).text()
    const medication = target.children().eq(7).text()
    const property = target.children().eq(8).text()
    const available = target.children().eq(9).text()
    new Promise(function (resolve, reject) {


      target.children().eq(1).empty().append(`
            <select class="main-category-select3 ui search fluid dropdown " id="mainCategory3" name="mainCategory3" style="width:200px">
          </select>`)
      target.children().eq(2).empty().append(`
            <select class="small-category-select3 ui search fluid dropdown " id="smallCategory3" name="smallCategory3" style="width:100px;">
            </select>`)
      target.children().eq(3).empty().append(`<input value="${name}" name="name" />`)
      target.children().eq(4).empty().append(`<input value="${ingredient}" name="ingredient" />`)
      target.children().eq(5).empty().append(`<input value="${amount}" name="amount"  />`)
      target.children().eq(6).empty().append(`<input type="text" value="${quantity}" name="quantity" />`)
      target.children().eq(7).empty().append(`<textarea name="medication" style="resize: none; overflow-x:hidden;">${medication}</textarea>`)
      target.children().eq(8).empty().append(`<textarea name="property" style="resize: none; overflow-x:hidden;">${property}</textarea>`)
      target.children().eq(9).empty().append(`
            <select class="select-available ui search fluid dropdown">
             <option value="1">활성</option>
             <option value="0">비활성</option>
            </select>`)
      target.children().eq(10).empty().append(`
            <a class="update-medicine-in-management">수정완료</a><br />
            <a class="cancel-update-medicine">수정취소</a>
            `)

      $('.select-available').dropdown();
      target.children().eq(9).children().dropdown('set selected', available);


      //분류 설정
      if ($('.main-category-select3 > select').children().length) {
        $('.main-category-select3 > select *').remove();
        $('.main-category-select3 > select').append(
          `<option class='default' value=''>대분류</option>`
        )
      }

      if ($('.small-category-select3 > select').children().length) {
        $('.small-category-select3 > select *').remove();
        $('.small-category-select3 > select').append(
          `<option class='default' value=''>소분류</option>`
        )
      }

      $('.dropdown').dropdown()
      $.ajax({
        type: 'GET',
        url: '/medicine/category/main',
        dataType: 'json',
        cache: false,
      }).done(results => {
        /**
         * 데이터 추가 후 modal
         */
        $('.main-category-select3 > select').append(
          _.map(results, result => {
            if (_.eq(result.primaryCategory, primaryCategory)) {
              return `<option selected value='${result.primaryCategory}'> ${result.primaryCategory} </option>`
            }
            return `<option value='${result.primaryCategory}'> ${result.primaryCategory} </option>`
          })
        );
      });

      //대분류 변경
      $('.main-category-select3').change(() => {
        update_main_category_value = $('.main-category-select3 option:selected').attr('value');
        var param = {
          primaryCategory: update_main_category_value
        }

        if ($('.small-category-select3 > select').children().length) {
          $('.small-category-select3 > select *').remove();
          $('.small-category-select3 > select').append(
            `<option class='default' value=''>소분류</option>`
          )
        }

        $.ajax({
          type: 'GET',
          url: '/medicine/category/small',
          data: param,
          dataType: 'json',
          cache: false,
        }).done(result => {
          for (var i in result) {
            if (i === '0') {
              $('.small-category-select3 > select').nextAll('div.text').text(`${result[i].secondaryCategory}`);

              $('.small-category-select3 > select').append(
                `<option selected value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
              )
              update_small_category_value = `${result[i].secondaryCategory}`;
            }
            else {
              $('.small-category-select3 > select').append(
                `<option value='${result[i].secondaryCategory}'> ${result[i].secondaryCategory} </option>`
              )
            }
          }
        });
      });
      $('.small-category-select3').change(() => {
        update_small_category_value = $('.small-category-select3 option:selected').attr('value');
        if (_.eq(primaryCategory, update_main_category_value) && _.eq(secondaryCategory, update_small_category_value)) {
          change_category = 0;
        } else {
          change_category = 1;
        }
      });

      resolve({ primaryCategory: primaryCategory, secondaryCategory: secondaryCategory });
    })
      .then(function (category) {
        setTimeout(function () {
          $("#mainCategory3").trigger("change");
          $("#smallCategory3").val(category.secondaryCategory).prop("selected", true).trigger("change");
        }, 800);
      });
  });


  //수정완료
  $(document).on('click', '.update-medicine-in-management', (e) => {
    if (!$('#medicine-management-form').valid()) return;

    const target = $(e.target).parent().parent();
    openConfirmModal(target, { confirmMessage: '약 정보 수정을 완료하시겠습니까?' }, updateMedicineInManagement);
  });

  function updateMedicineInManagement(target) {
    let id = target.attr('id');
    let docs = {};

    docs.id = id;
    let v = $('#medicine-management-form').serializeArray();
    for (var i in v) {
      docs[v[i].name] = v[i].value;
    }

    docs.available = target.children().eq(9).children().children().val();
    docs.primaryCategory = $('.main-category-select3 option:selected').attr('value');
    docs.secondaryCategory = update_small_category_value;
    let medicines = JSON.parse(window.localStorage.getItem('medicine'));
    docs.totalAmount = _.filter(medicines, ['id', parseInt(id)])[0].totalAmount;
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
      .then(function () {
        $.uiAlert({
          textHead: '[알림]',
          text: docs.name + ' 정보 수정 완료',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        });
        updateLocalStorage(function (target) {
          let id = target.attr('id');

          if (_.eq(change_category, 1)) {
            $("#management-main-category-select").val(update_main_category_value).prop("selected", true).trigger("change");
            $("#management-small-category-select").val(update_small_category_value).prop("selected", true).trigger("change");
            $('body').animate({ scrollTop: 4000 }, 1000);
          } else {
            let medicines = JSON.parse(window.localStorage.getItem('medicine'));
            cancelUpdateMedicine(target, _.filter(medicines, ['id', parseInt(id)])[0]);
          }
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


  //수정 취소
  $(document).on('click', '.cancel-update-medicine', (e) => {
    const target = $(e.target).parent().parent();
    let id = target.attr('id');
    let medicines = JSON.parse(window.localStorage.getItem('medicine'));
    cancelUpdateMedicine(target, _.filter(medicines, ['id', parseInt(id)])[0]);
  });

  function cancelUpdateMedicine(target, data) {
    const { primaryCategory, secondaryCategory, name, ingredient, amount, quantity, medication, property, available } = data;

    target.children().eq(1).empty().append(primaryCategory)
    target.children().eq(2).empty().append(secondaryCategory)
    target.children().eq(3).empty().append(name)
    target.children().eq(4).empty().append(ingredient)
    target.children().eq(5).empty().append(amount)
    target.children().eq(6).empty().append(quantity)
    target.children().eq(7).empty().append(medication)
    target.children().eq(8).empty().append(property)
    target.children().eq(9).empty().append(available == "1" ? '활성' : '비활성')
    target.children().eq(10).empty().append(`
      <i class="configure-medicine-by-management configure link icon"></i>
      <i class="delete-medicine-by-management trash link icon"></i>`)
  }

  /**
    * 약품 정보 삭제
    */
  $(document).on('click', '.delete-medicine-by-management', (e) => {
    const medicineId = [];
    medicineId.push($(e.target).parent().parent().attr('id'));
    let name = $(e.target).parent().parent().children().eq(3).text()
    let target = { "medicineIds": JSON.stringify(medicineId) };
    openConfirmModal(target, { confirmMessage: `'${name}'을(를) 삭제하시겠습니까?` }, deleteMedicines);
  });

  /**
    * 약품 추가 클릭시
    */
  var add_main_category_value = '';
  var add_small_category_value = '';

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
      url: '/medicine/category/main',
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
      url: '/medicine/category/small',
      data: param,
      dataType: 'json',
      cache: false,
    }).done(result => {
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
  });

  $('#add-medicine-btn').on('click', function () {
    if (!$('#add-medicine-form').valid()) return false;

    if (!add_main_category_value || add_main_category_value === "") {
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

    if (!add_small_category_value || add_small_category_value === "") {
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
    for (var i in v) {
      docs[v[i].name] = v[i].value;
    }
    docs["primaryCategory"] = add_main_category_value;
    docs["secondaryCategory"] = add_small_category_value;
    insertMedicine(docs);
  });

  function insertMedicine(data) {
    http
      .postMethod(`/medicine/insert`, data)
      .then(result => {
        const { data, code } = result;

        if (!_.eq(code, resultCode.success)) {
          return Promise.reject(`insert fail new medicine data ${data.error}`);
        }

        return Promise.resolve(data);
      })
      .then(function () {
        $.uiAlert({
          textHead: '[알림]',
          text: '약정보 추가 완료',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        });
        updateLocalStorage(function (target) {
          $('#add-medicine-form')[0].reset();

          $('.ui.longer.modal.pharmacopoeia-add').modal('hide')

          // var changeCategory = function(){
          //     return new Promise(function(resolve, reject){
          //
          //       $("#management-main-category-select").val(target.main).prop("selected", true).trigger("change");
          //       $("#management-small-category-select").val(target.small).prop("selected", true).trigger("change");
          //
          //       resolve();
          //     });
          // }

          // changeCategory()
          // .then(function(){
          //   var n;
          //   setTimeout(function(){
          //      n = $('#medicine-management-table').height();
          //   }, 2000);
          //   return n;
          // })
          // .then(function(height){
          //     console.log(height);
          //     $('body').animate({scrollTop: height}, 1000);
          // })

          $("#management-main-category-select").val(target.main).prop("selected", true).trigger("change");
          $("#management-small-category-select").val(target.small).prop("selected", true).trigger("change");
          $('body').animate({ scrollTop: 4000 }, 1000);
        }, { "main": add_main_category_value, "small": add_small_category_value });


      })
      .catch(error => {
        console.log(error);
        $.uiAlert({
          textHead: '[ERROR-CODE 7009]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        });
      });
  }


  $('#add-medicine-cancel-btn').on('click', function () {
    $('#add-medicine-form')[0].reset();

    $('.ui.longer.modal.pharmacopoeia-add').modal('hide')
  });
  //약 일괄삭제
  $('#delete-medicines-by-management').on('click', () => {
    let medicineIds = [];
    $(":checkbox[name='checkMedicine']:checked").each(function () {
      medicineIds.push($(this).val());
    });

    if (medicineIds.length === 0) {
      $.uiAlert({
        textHead: '[경고]',
        text: '삭제할 약들을 선택해 주세요!',
        bgcolor: '#FF5A5A',
        textcolor: '#fff',
        position: 'top-center',
        time: 2
      });

      return false;
    }

    let target = { "medicineIds": JSON.stringify(medicineIds) };
    openConfirmModal(target, { confirmMessage: '선택한 약들을 일괄 삭제하시겠습니까?' }, deleteMedicines);
  });

  function deleteMedicines(data) {
    http
      .postMethod(`/medicine/delete`, data)
      .then(result => {
        const { data, code } = result;

        if (!_.eq(code, resultCode.success)) {
          return Promise.reject(`delete fail medicine data ${data.error}`);
        }

        return Promise.resolve(data);
      })
      .then(function () {
        let ids = JSON.parse(data.medicineIds);
        for (var key in ids) {
          $('#' + ids[key]).remove();
        }

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

  function openConfirmModal(target, message, gotoFunction) {

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

  $('#select-all-medicine-button').click(function () {
    $("#management-main-category-select").val('').prop("selected", true);
    $("#management-small-category-select").val('').prop("selected", true);

    let medicines = JSON.parse(window.localStorage.getItem('medicine'));

    if ($('#medicine-management-table-body').children().length)
      $('#medicine-management-table-body *').remove();

    setMedicineTableBody(medicines);
    $.uiAlert({
      textHead: '[알림]',
      text: ' 전체 약품 정보가 조회되었습니다 ',
      bgcolor: '#55a9ee',
      textcolor: '#fff',
      position: 'top-left',
      time: 2,
    });
  })

  $('#select-medicine-excel-button').click(function (e) {

    const { searchSet, searchText } = selectedCondition;
    let { categoryMain, categorySmall } = selectedCondition;

    let message = '';
    let searchName = searchSet === 'name' ? '약품명' : '성분명';
    categoryMain = categoryMain.trim();
    categorySmall = categorySmall.trim();

    if (searchText) {
      message = `${searchName}_${searchText}_`;
    } else if (categoryMain) {
      message = `${categoryMain}_${categorySmall}_`;
    } else {
      message = '약전_전체_';
    }

    const medicineFileName = `${message}medicine.xls`;
    const medicineFileNameTable = 'medicine-management-table';

    $('#select-medicine-excel-button').attr('download', medicineFileName)
    return exportFunc.excel(this, medicineFileNameTable, '약전');
  });

  function updateLocalStorage(callback, target) {
    $.ajax({
      type: 'GET',
      url: '/medicine/list/management',
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
      if (callback) {
        callback(target);
      }
    });
  }

  init();
})();
