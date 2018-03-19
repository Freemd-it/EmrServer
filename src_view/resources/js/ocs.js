import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';
import { F_OK } from 'constants';
import moment from 'moment';

function init() {
    if (!_.eq(location.pathname, '/ocs')) return;
    getOcsData();
    setDatePicker();
    // $('#startTime').val(moment().format(''))
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

function dataInit(startTimeDom, endTimeDom) {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    if (!startTimeDom.value) {
        startTimeDom.value = date.slice(0, 10);
    }
    if (!endTimeDom.value) {
        endTimeDom.value = date.slice(0, 10);
    }
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

/**
 *
 * @param {number} page page index
 * @description
 * 이전 OCS, 현재 OCS 데이터 불러오기
 */
function getOcsData(page = 1, btn = false) {
    /**
     * 기존 데이터 제거
     */
    $('table tbody').empty();
    $('.ocs-table').empty();

    const startTimeDom = document.getElementById('startTime');
    const endTimeDom = document.getElementById('endTime');

    dataInit(startTimeDom, endTimeDom);

    const { isCheck, message } = dateValidationCheck(startTimeDom, endTimeDom);
    var { value: startTime } = startTimeDom;
    var { value: endTime } = endTimeDom;

    startTime = moment(startTime).format('YYYY-MM-DD')
    endTime = moment(endTime).format('YYYY-MM-DD')

    if (!isCheck) {
        return alert(message);
    }

    http
        .getMethod(`/ocs/index/${page}?startTime=${startTime}&endTime=${endTime}`)
        .then(result => {
            const { data, code } = result;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject(`fail ocs data ${data.error}`);
            }
            return Promise.resolve(data);
        })
        .then(ocsTableDataSetting)
        .catch(error => console.log(error))
}
window.getOcsData = getOcsData;

/**
 *
 * @param {object} datas
 * @description
 * OCS 테이블 데이터
 */
function ocsTableDataSetting(result) {
    const {
        endPage, startPage, totalPage, max, page, pageSize, datas
    } = result;
    const changeToHangle = ['접수 완료', '예진 완료', '조제 대기', '조제중', '처방 대기', '완료'];
    const START_NUM = 1;
    const footEle = [];
    /**
     * table row data setting
     */
    $('table tbody').append(
        _.map(datas, data => {
            const { chartNumber, name, gender, birth, status } = data;
            return ` <tr>
                <td>${chartNumber}</td>
                <td>${name}</td>
                <td>${gender}</td>
                <td>${birth}</td>
                <td>${changeToHangle[status - 1]}</td>
            </tr>`
        })
    );

    /**
     * index data setting
     */
    // LEFT
    if (page > pageSize) {
        footEle.push(`
        <a class="icon item ocs-paging" style="text-decoreation:none" onclick="this.getOcsData(${startPage - 1})">
            <i class="left chevron icon"></i>
        </a>`)
    } else {
        footEle.push(`
        <a class="icon item">
            <i class="left chevron icon"></i>
        </a>`)
    }
    // Center
    footEle.push(_.map(_.range(startPage, endPage + 1), (num) => {
        if (_.eq(num, page)) {
            return `<a class="item">${num}</a>`
        } else {
            return `<a class="item ocs-paging" style="text-decoreation:none" onclick="javascript:getOcsData(${num})">${num}</a>`

        }
    }))
    // Right
    if (endPage < totalPage) {
        footEle.push(`
        <a class="icon item ocs-paging"  style="text-decoreation:none"  onclick="this.getOcsData(${endPage + 1})">
          <i class="right chevron icon"></i>
        </a>`)
    } else {
        footEle.push(`
        <a class="icon item">
          <i class="right chevron icon"></i>
        </a>`)
    }
    $('.ocs-table').append(_.flatten(footEle));

}

/**
 * Data Reload
 */
$('.ocs-reload__btn ').click((e) => {
    const $target = $(e.target);
    const page = 1;
    const btnClick = true;
    getOcsData(page, btnClick);
})


/**
 * Excel Download
 */
$('.ocs-excel').click((e) => {
    const startTimeDom = document.getElementById('startTime');
    const endTimeDom = document.getElementById('endTime');
    const { isCheck, message } = dateValidationCheck(startTimeDom, endTimeDom);
    let { value: startTime } = startTimeDom;
    let { value: endTime } = endTimeDom;

    startTime = moment(startTime).format('YYYY-MM-DD')
    endTime = moment(endTime).format('YYYY-MM-DD')

    if (!isCheck) {
        return alert(message);
    }
    location.href = `/ocs/excel?startTime=${startTime}&endTime=${endTime}`;
})
init();
