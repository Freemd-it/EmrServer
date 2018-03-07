import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import moment from 'moment'

function init() {
    if (!_.eq(location.pathname, '/management')) return;
    setDatePicker();
    const startTimeDom = document.getElementById('startTime');
    const endTimeDom = document.getElementById('endTime');
    dataInit(startTimeDom, endTimeDom);
}

$('.history-medicine-search-select').change(() => {

  var sourceTarget;
  $('.search.ui').search({ source: [] })

  if ($('.history-medicine-search-select option:selected').val() === '1') {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineName'));
  } else {
    sourceTarget = JSON.parse(window.localStorage.getItem('medicineIngredient'));
  }
  $('.search.ui').search({ source: sourceTarget })
});

$('.management-medicine-history-search-button').on('click', () => {

  const startTimeDom = document.getElementById('startTime');
  const endTimeDom = document.getElementById('endTime');
  const medicineCategory = $('.history-medicine-search-select option:selected').val();
  const searchWord = $.trim($('input[name=historyMedicineSearchText]').val());

  const { isCheck, message } = dateValidationCheck(startTimeDom, endTimeDom);
  var { value: startTime } = startTimeDom;
  var { value: endTime } = endTimeDom;

  startTime = moment(startTime).format('YYYY-MM-DD')
  endTime = moment(endTime).format('YYYY-MM-DD')

  if (!isCheck) {
      return alert(message);
  }

  if (endTime === 'Invalid date') {
    return $.uiAlert({
      textHead: '[경고]',
      text: '검색 종료 날짜를 다시 확인해주세요!',
      bgcolor: '#FF5A5A',
      textcolor: '#fff',
      position: 'top-left',
      time: 2
    })
  } else {

    http
        .getMethod(`/prescription/history/${startTime}/${endTime}/${medicineCategory}?word=${searchWord}`)
        .then(result => {

            const { code } = result;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject(`fail get use medicine history ${data.error}`);
            }
            return Promise.resolve(result);
        })
        .then(setHistoryTable)
        .catch(error => console.log(error))
  }
})

function setHistoryTable (result) {

  const { data } = result
  if (data.length === 0) {
    return $.uiAlert({
      textHead: '[알림]',
      text: '검색 결과가 없습니다. 약품명 또는 성분명을 다시 확인해주세요.',
      bgcolor: '#FF5A5A',
      textcolor: '#fff',
      position: 'top-left',
      time: 2
    })

    $('#history-management-table-body').append(
      `<tr>
        <td class="defaultHistoryForManagementTableBody" style="text-align:center;" colspan="5">
        날짜를 지정한 뒤 약품 또는 성분명을 입력하지 않고 검색 버튼을 누르면 해당 기간 내 사용한 전체 약품 데이터가 조회됩니다.
        </td>
      </tr>`
    );
  }

  $('#history-management-table-body').empty()
  $('#history-management-table-body').append(
    _.map(data, data => {
        const { medicineName, medicineIngredient, total, medicine } = data;
        return ` <tr>
            <td>${medicineName}</td>
            <td>${medicineIngredient}</td>
            <td>${total}</td>
            <td>${medicine.amount}</td>
            <td>${medicine.quantity}</td>
        </tr>`
    })
  );
}

function setDatePicker () {
  $('#ocsRangeStart').calendar({
    type: 'date',
    endCalendar: $('#ocsRangeEnd')
  });
  $('#ocsRangeEnd').calendar({
    type: 'date',
    startCalendar: $('#ocsRangeStart')
  });
}

function dateValidationCheck(startTimeDom, endTimeDom) {
    let { value: startTime } = startTimeDom;
    let { value: endTime } = endTimeDom;

    startTime = moment(startTime).format('YYYY-MM-DD')
    endTime = moment(endTime).format('YYYY-MM-DD')

    try {
        if (!startTime || !endTime) {
            throw new Error('날짜를 지정해주세요.')
        }
        if (startTime > endTime) {
            throw new Error('시작 날짜가 더 작아야합니다.')
        }
    } catch (error) {
        return { isCheck: false, message: error.message };
    }
    return { isCheck: true };
}

function dataInit(startTimeDom, endTimeDom) {
    const date = new Date();
    if (!startTimeDom.value) {
        startTimeDom.value = date.toISOString().slice(0, 10);
    }
    if (!endTimeDom.value) {
        endTimeDom.value = date.toISOString().slice(0, 10);
    }
}

init();
