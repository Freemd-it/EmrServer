import $ from 'jquery';
import 'jquery-validation';
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


//약전 validation
$.extend( $.validator.messages, {
  min: "1 이상의 수만 입력 가능합니다.",
  digits: "숫자를 입력해주세요.",
  maxlength: $.validator.format( " 최대 {0}자까지 입력 가능합니다. " )
});
$('#prescriptionForm').validate({
  onkeyup : false,
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

  if ($('#prescription-table-body .defaultPrescriptionTableBody').length)
    $('#prescription-table-body .defaultPrescriptionTableBody').remove();

  if (window.location.pathname === '/pharmacy') {
    var icon = `<td><a class="add-medicine-in-prescription">추가하기</a><br /><a class="add-cancel-medicine-in-prescription">취소하기</a></td>`;
  } else if (window.location.pathname === '/originalDiagnosis'){
    var icon = `<td class="deletePrescriptionTD"><i class="sign out icon delete-icon-size deleteTargetByIcon"></i></td>`;
  }

  JSON.parse(window.localStorage.getItem('medicine')).find(function (x) {
    if (x.id === Number(e.currentTarget.id)) {
      $('#prescription-table-body').append(
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
               ${icon}
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
    case 5: return '검수 대기'; break;
    case 6: return '처방 대기'; break;
    case 7: return '처방 완료'; break;
  }
}

function getStatusClass(status) {

  switch (status) {
    case 1: return 'disabled'; break;
    case 2: return 'disabled'; break;
    case 4: return 'ocs-hover positive'; break;
    case 5: return 'ocs-hover ocs-warning'; break;
    case 6: return 'ocs-hover negative'; break;
    default : return 'ocs-hover selectable'; break;
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

  // TODO 권한에 따른 처방전 보여주기
  const chartNumber = $(e.target.parentNode).attr('attr');
  getPrescription(chartNumber);
});

function getPrescription(chartNumber) {

  $('#prescription-table-body').empty();

  http
      .getMethod(`/prescription/${chartNumber}`)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`get fail prescriptions data ${data.error}`);
          }
          return Promise.resolve(data);
      })
      .then(prescriptionDataSetting)
      .catch(error => console.log(error))
}

function prescriptionDataSetting(data) {

  const { prescriptions, chartNumber, name = data.patient.name, impression, presentIllness, treatmentNote } = data;

  if (prescriptions.length === 0) {
    $('#prescription-table-body').append(
      `<tr>
          <td class="defaultPrescriptionTableBody" style="text-align:center;" colspan="7">처방된 약이 없습니다. 본진 보조에게 먼저 문의해본 후 IT 본부 단원을 찾아주세요.</td>
      </tr>`
    )
  } else {
    $('#prescription-table-body').append(
        _.map(prescriptions, data => {
          const { id, medicineName, medicineIngredient, doses, dosesCountByDay, dosesDay, remarks } = data;
          return ` <tr prescription-id="${id}" class="ui fluid">
            <td>${medicineName}</td>
            <td>${medicineIngredient}</td>
            <td>${doses}</td>
            <td>${dosesCountByDay}</td>
            <td>${dosesDay}</td>
            <td>${remarks === '' ? '-' : remarks}</td>
            <td>
              <i class="configure-medicine configure link icon"></i>
              <i class="delete-medicine trash link icon"></i>
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

$(document).on('click', '.configure-medicine', (e) => {

  const target = $(e.target).parent().parent();
  transformPrescriptionInput(target)
});

function transformPrescriptionInput(target) {

  const currentDoses = target.children().eq(2).text()
  const currentDosesCountByDay = target.children().eq(3).text()
  const currentDosesDay = target.children().eq(4).text()
  const currentRemarks = target.children().eq(5).text() === '-' ? '' : target.children().eq(5).text();

  target.children().eq(2).empty().append(`<input value="${currentDoses}" digits="true" min="1" />`)
  target.children().eq(3).empty().append(`
    <select class="prescription-doses-for-day ui search fluid dropdown">
       <option value="qd">qd</option>
       <option value="bid">bid</option>
       <option value="tid">tid</option>
       <option value="hs">hs</option>
    </select>
    `)
  target.children().eq(4).empty().append(`<input value="${currentDosesDay}" digits="true" min="1" />`)
  target.children().eq(5).empty().append(`<input type="text" value="${currentRemarks}" maxlength="100" />`)
  target.children().eq(6).empty().append(`
    <a class="update-medicine-in-prescription">수정완료</a><br />
    <a class="cancel-update-prescription">수정취소</a>
    `)
  $('.prescription-doses-for-day').dropdown();
  target.children().eq(3).children().dropdown('set selected', currentDosesCountByDay);

  /**
   * TODO 파트장 처방전 수정
   * @description 이 위에것들 다 값으로 변환 후 append input 창 + value로 박아줄 것
   * 그리고 기타에 버튼 수정 취소로 변환 수정 시 서버 호출 후 다시 아이콘이랑 휴지통으로 취소시 그냥 롤백
   */
}

$(document).on('click', '.update-medicine-in-prescription', (e) => {

  const target = $(e.target).parent().parent();
  openConfirmModal(target, { confirmMessage: '정말로 처방전을 수정하시겠습니까?' }, updateMedicineInPrescription)
});

function updateMedicineInPrescription (target) {

  const data = {};
  data.prescriptionId = target.attr('prescription-id');
  data.doses = target.children().eq(2).children().val();
  data.dosesCountByDay = target.children().eq(3).children().children().val();
  data.dosesDay = target.children().eq(4).children().val();
  data.remarks = target.children().eq(5).children().val();

  http
      .postMethod(`/prescription/update`, data)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`get fail prescriptions data ${data.error}`);
          }
          data.target = target;
          return Promise.resolve(data);
      })
      .then(resultUpdatePrescription)
      .catch(error => console.log(error))
}

function resultUpdatePrescription (result) {

  if (result[0] === 1) {

    getMedicineInPrescription(result.target)
    $.uiAlert({
      textHead: '[알림]',
      text: '처방전 수정이 완료되었습니다.',
      bgcolor: '#55a9ee',
      textcolor: '#fff',
      position: 'top-left',
      time: 2,
    })
  } else {

    getMedicineInPrescription(result.target)
    $.uiAlert({
      textHead: '[ERROR-CODE 7001]',
      text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
      bgcolor: '#F2711C',
      textcolor: '#fff',
      position: 'top-center',
      time: 10,
    })
  }
}

$(document).on('click', '.cancel-update-prescription', (e) => {

  const target = $(e.target).parent().parent();
  getMedicineInPrescription(target)

});

function getMedicineInPrescription (target) {

  const prescriptionId = target.attr('prescription-id');

  http
      .getMethod(`/prescription/medicine/${prescriptionId}`)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`get fail prescriptions data ${data.error}`);
          }
          data.target = target;
          return Promise.resolve(data);
      })
      .then(cancelUpdatePrescription)
      .catch(error => console.log(error))
}

function cancelUpdatePrescription(data) {

  const { target, doses, dosesCountByDay, dosesDay, remarks } = data;

  target.children().eq(2).empty().append(doses)
  target.children().eq(3).empty().append(dosesCountByDay)
  target.children().eq(4).empty().append(dosesDay)
  target.children().eq(5).empty().append(remarks  === '' ? '-' : remarks)
  target.children().eq(6).empty().append(`
      <i class="configure-medicine configure link icon"></i>
      <i class="delete-medicine trash link icon"></i>`)
}

$(document).on('click', '.add-medicine-in-prescription', (e) => {

  const target = $(e.target).parent().parent();
  const medicine = target.children().eq(0).text();
  openConfirmModal(target, { confirmMessage: '처방전에 ' + medicine + '을(를) 추가하시겠습니까?' }, getAddMedicineInPrescription)

});

function getAddMedicineInPrescription (target) {

  const addMedicine = {};
  addMedicine.medicine_id = target.attr('id')
  addMedicine.chartNumber = $('#pharmacy-chart-id').val()
  addMedicine.medicineName = target.children().eq(0).text()
  addMedicine.medicineIngredient = target.children().eq(1).text()
  addMedicine.doses = target.children().eq(2).children().val()
  addMedicine.dosesCountByDay = target.children().eq(3).children().children().val()
  addMedicine.dosesDay = target.children().eq(4).children().val()
  addMedicine.remarks = target.children().eq(5).children().val()

  http
      .postMethod(`/prescription/create`, addMedicine)
      .then(result => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`fail add medicine data ${data.error}`);
          }
          data.target = target;
          return Promise.resolve(data);
      })
      .then(resultAddPrescription)
      .catch(error => console.log(error))
}

function resultAddPrescription (result) {

  result.target.removeAttr('id');
  result.target.attr('prescription-id', result.id);

  if (result.id > 0) {

    getMedicineInPrescription(result.target)
    $.uiAlert({
      textHead: '[알림]',
      text: '처방전 수정이 완료되었습니다.',
      bgcolor: '#55a9ee',
      textcolor: '#fff',
      position: 'top-left',
      time: 2,
    })
  } else {

    getMedicineInPrescription(result.target)
    $.uiAlert({
      textHead: '[ERROR-CODE 7002]',
      text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
      bgcolor: '#F2711C',
      textcolor: '#fff',
      position: 'top-center',
      time: 10,
    })
  }
}

$(document).on('click', '.add-cancel-medicine-in-prescription', (e) => {

  const target = $(e.target).parent().parent();
  target.remove();

});

$(document).on('click', '.delete-medicine', (e) => {

  const target = $(e.target).parent().parent();
  const medicine = target.children().eq(0).text();
  openConfirmModal(target, { confirmMessage: '정말로 ' + medicine + '을(를) 처방전에서 삭제하시겠습니까?' }, deleteMedicineInPrescription)
});

function deleteMedicineInPrescription(target) {

  const deleteMedicine = {
      prescriptionId: target.attr('prescription-id')
  }

  http
      .postMethod(`/prescription/delete`, deleteMedicine)
      .then(result => {

          const { code } = result;
          delete result.headers;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject(`fail delete medicine data ${data.error}`);
          }

          result.target = target;
          return Promise.resolve(result);
      })
      .then(resultDeletePrescription)
      .catch(error => console.log(error))
}

function resultDeletePrescription (result) {

  const { target } = result;

  if (result.data === 1) {

    $.uiAlert({
      textHead: '[알림]',
      text: '처방전 내 ' + target.children().eq(0).text() + ' 이(가) 삭제되었습니다.',
      bgcolor: '#55a9ee',
      textcolor: '#fff',
      position: 'top-left',
      time: 2,
    })
    target.remove();

  } else {

    $.uiAlert({
      textHead: '[ERROR-CODE 7003]',
      text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
      bgcolor: '#F2711C',
      textcolor: '#fff',
      position: 'top-center',
      time: 10,
    })
  }
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

$(document).on('click', '#pharmaceutical-start', (e) => {

  const params = {};
  params.chartNumber = $('#pharmacy-chart-id').val();
  params.name = $('#pharmacy-chart-name').val();
  params.updateStatus = '4';

  openConfirmModal(params, { confirmMessage: '차트번호 : [' + params.chartNumber + '] \r\n' + params.name + '님의 조제를 시작하시겠습니까?' }, updatePrescriptionStatus)
});

$(document).on('click', '#pharmaceutical-end', (e) => {

  const params = {};
  params.chartNumber = $('#pharmacy-chart-id').val();
  params.name = $('#pharmacy-chart-name').val();
  params.updateStatus = '5';

  openConfirmModal(params, { confirmMessage: '차트번호 : [' + params.chartNumber + '] \r\n' + params.name + '님의 조제 검수를 요청하시겠습니까?' }, updatePrescriptionStatus)
});

$(document).on('click', '#inspection-complete', (e) => {

  const params = {};
  params.chartNumber = $('#pharmacy-chart-id').val();
  params.name = $('#pharmacy-chart-name').val();
  params.updateStatus = '6';

  openConfirmModal(params, { confirmMessage: '차트번호 : [' + params.chartNumber + '] \r\n' + params.name + '님의 복약지도를 요청하시겠습니까?' }, updatePrescriptionStatus)
});

$(document).on('click', '#prescription-complete', (e) => {

  const params = {};
  params.chartNumber = $('#pharmacy-chart-id').val();
  params.name = $('#pharmacy-chart-name').val();
  params.updateStatus = '7';

  openConfirmModal(params, { confirmMessage: '차트번호 : [' + params.chartNumber + '] \r\n' + params.name + '님의 복약지도를 완료하시겠습니까?' }, updatePrescriptionStatus)
});

function updatePrescriptionStatus (params) {

  http
      .postMethod(`/chart/update`, params)
      .then(result => {

          result.params = params
          const { data, status } = result

          if (!_.eq(status, 200)) {
              return Promise.reject(`fail update chart ${data.error}`);
          }

          return Promise.resolve(result);
      })
      .then(resultStartPharmaceutical)
      .catch(error => console.log(error))
}

function resultStartPharmaceutical (result) {

  const { params, data } = result

  switch (params.updateStatus) {
    case '4' :
      if (data[0] === 1)  {
        $.uiAlert({
          textHead: '[알림]',
          text: '차트번호 [' + params.chartNumber + '] ' + params.name + ' 님의 조제가 할당되었습니다.',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
        resetPrescriptionPage();
        getPharmacyOcsData('now');
      } else {
        $.uiAlert({
          textHead: '[ERROR-CODE 7004]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        })
        getPharmacyOcsData('now');
      }
    break;

    case '5' :
      if (data[0] === 1)  {
        $.uiAlert({
          textHead: '[알림]',
          text: '차트번호 [' + params.chartNumber + '] ' + params.name + ' 님의 조제가 완료되었습니다.',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
        resetPrescriptionPage();
        getPharmacyOcsData('now');
      } else {
        $.uiAlert({
          textHead: '[ERROR-CODE 7005]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        })
        getPharmacyOcsData('now');
      }
    break;

    case '6' :
      if (data[0] === 1)  {
        $.uiAlert({
          textHead: '[알림]',
          text: '차트번호 [' + params.chartNumber + '] ' + params.name + ' 님의 검수가 완료되었습니다.',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
        resetPrescriptionPage();
        getPharmacyOcsData('now');
      } else {
        $.uiAlert({
          textHead: '[ERROR-CODE 7006]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        })
        getPharmacyOcsData('now');
      }
    break;

    case '7' :
      if (data[0] === 1)  {
        $.uiAlert({
          textHead: '[알림]',
          text: '차트번호 [' + params.chartNumber + '] ' + params.name + ' 님의 복약지도가 완료되었습니다.',
          bgcolor: '#55a9ee',
          textcolor: '#fff',
          position: 'top-left',
          time: 2,
        })
        resetPrescriptionPage();
        getPharmacyOcsData('now');
      } else {
        $.uiAlert({
          textHead: '[ERROR-CODE 7007]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 10,
        })
        getPharmacyOcsData('now');
      }
    break;
  }
}

function resetPrescriptionPage () {

  $('#pharmacy-chart-id').val('');
  $('#pharmacy-chart-name').val('');
  $('#prescription-table-body').empty().append(
    `<tr>
      <td class="defaultPrescriptionTableBody" style="text-align:center;" colspan="7">조제를 시작할 환자를 선택해주세요.</td>
    </tr>`
  );
  $('.pharmacy-impression').val('');
  $('.pharmacy-present-illness').val('');
  $('.pharmacy-treatment-note').val('');
}

init();
