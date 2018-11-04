import _ from 'lodash';
import queryString from 'query-string';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import exportFunc from '../utils/excel';
import moment from 'moment'

(function () {
  // 선택 된 검색 목록 ( excel 다운로드 할 경우 )
  const selectedCondition = {};
  const SEARCH_OPTIONS = ['', 'name', 'ingredient'];
  selectedCondition.searchSet = SEARCH_OPTIONS[1]; // 검색 조건
  selectedCondition.searchText = '';

  // 입력이 변경 될때 마다 / 검색 조건 초기화
  $('input[name=historyMedicineSearchText]').change((e) => {
    selectedCondition.searchText = '';
  });

  function init() {
    if (!_.eq(location.pathname, '/management')) return;
    setDatePicker();
    const startTimeDom = document.getElementById('startTime');
    const endTimeDom = document.getElementById('endTime');
    dataInit(startTimeDom, endTimeDom);
  }

  $('.history-medicine-search-select').change((e) => {
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

    const { isCheck, message,
      startTime, endTime } = dateValidationCheck(startTimeDom, endTimeDom);

    if (!isCheck) {
      return $.uiAlert({
        textHead: '[경고]',
        text: message,
        bgcolor: '#FF5A5A',
        textcolor: '#fff',
        position: 'top-left',
        time: 2
      })
    }

    // 선택 조건 ( excel 다운로드 할 경우 )
    selectedCondition.searchText = searchWord;
    selectedCondition.searchSet = SEARCH_OPTIONS[medicineCategory];

    http
      .getMethod(`/prescription/history/${startTime}/${endTime}/${medicineCategory}?word=${searchWord}`)
      .then(result => {

        const { code, data } = result;

        if (!_.eq(code, resultCode.success)) {
          return Promise.reject(`fail get use medicine history ${data.error}`);
        }
        return Promise.resolve(result);
      })
      .then(setHistoryTable)
      .catch(error => console.log(error))

  })

  function setHistoryTable(result) {

    $('#history-management-table-body').empty()

    const { data } = result
    if (data.length === 0) {
      $('#history-management-table-body').append(
        `<tr>
        <td class="defaultHistoryForManagementTableBody" style="text-align:center;" colspan="7">
        날짜를 지정한 뒤 약품 또는 성분명을 입력하지 않고 검색 버튼을 누르면 해당 기간 내 사용한 전체 약품 데이터가 조회됩니다.
        </td>
      </tr>`
      );
      return $.uiAlert({
        textHead: '[알림]',
        text: '검색 결과가 없습니다. 약품명 또는 성분명을 다시 확인해주세요.',
        bgcolor: '#FF5A5A',
        textcolor: '#fff',
        position: 'top-left',
        time: 2
      })
    }

    $('#history-management-table-body').empty()
    $('#history-management-table-body').append(
      _.map(data, data => {
        const { primaryCategory, secondaryCategory, name, ingredient, totalAmount, quantity, totalUsage, createdAt} = data;
        return ` <tr>
            <td>${primaryCategory}</td>
            <td>${secondaryCategory}</td>
            <td>${name}</td>
            <td>${ingredient}</td>
            <td>${totalUsage}</td>
            <td>${totalAmount}</td>
            <td>${quantity}</td>
        </tr>`
      })
    );
    return $.uiAlert({
      textHead: '[알림]',
      text: '검색 결과 조회가 완료되었습니다.',
      bgcolor: '#55a9ee',
      textcolor: '#fff',
      position: 'top-left',
      time: 2
    });
  }

  function setDatePicker() {
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
      if (endTime === 'Invalid date') {
        throw new Error('검색 종료 날짜를 다시 확인해주세요!')
      }
    } catch (error) {
      return { isCheck: false, message: error.message };
    }
    return { isCheck: true, startTime, endTime };
  }

  function dataInit(startTimeDom, endTimeDom) {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    if (!startTimeDom.value) {
      startTimeDom.value = date.slice(0, 10);
    }
    if (!endTimeDom.value) {
      endTimeDom.value = date.slice(0, 10);
    }
  }

  $('#select-history-excel-button').click(function () {

    const startTimeDom = document.getElementById('startTime');
    const endTimeDom = document.getElementById('endTime');
    const { startTime, endTime } = dateValidationCheck(startTimeDom, endTimeDom);
    const historyFileName = `${startTime}_${endTime}_history.xls`;
    const historyTable = 'history-management-table';

    $('#select-history-excel-button').attr('download', historyFileName)
    return exportFunc.excel(this, historyTable, '약 사용 히스토리');
  });

  init();
})();
