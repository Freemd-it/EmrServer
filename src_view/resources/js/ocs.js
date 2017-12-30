import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import $ from 'jquery';


function init() {
    if (!_.eq(location.pathname, '/views/ocs')) return; 
    getOcsData('now')
}

/**
 * 
 * @param {string} nowData now or before
 * @param {number} page page index
 * @description
 * 이전 OCS, 현재 OCS 데이터 불러오기 
 */
function getOcsData(nowData = "now", page = 1) {
    http
        .getMethod(`/ocs/${nowData}/${page}`)
        .then(result => {
            const { data, code } = result;
            data.nowData = nowData;

            if (!_.eq(code, resultCode.success)) {
                return Promise.reject(`fail ocs data ${data.error}`);
            }
            return Promise.resolve(data);
        })
        .then(ocsTableDataSetting)
        .catch(error => console.log(error))
}

/**
 * 
 * @param {object} datas 
 * @description
 * OCS 테이블 데이터 
 */
function ocsTableDataSetting(result) {
    const { endPage, startPage, totalPage, max,
        page, pageSize, datas, nowData } = result;
    const changeToHangle = ['예진 대기', '본진 대기', '처방 대기', '처방중', '완료'];
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
                <td>${changeToHangle[status + START_NUM]}</td>
            </tr>`
        })
    );

    /**
     * index data setting
     */
    // LEFT
    if (page > pageSize) {
        footEle.push(`
        <a class="icon item" style="text-decoreation:none" href="/ocs/${nowData}/${startPage - 1}">
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
            return `<a class="item" style="text-decoreation:none" href="/ocs/${nowData}/${num}">${num}</a>`

        }
    }))
    // Right
    if (endPage < totalPage) {
        footEle.push(`
        <a class="icon item"  style="text-decoreation:none" href="/ocs/${nowData}/${endPage + 1}">
          <i class="right chevron icon"></i>
        </a>`)
    } else {
        footEle.push(`
        <a class="icon item">
          <i class="right chevron icon"></i>
        </a>`)
    }

    $('.floated .pagination').append(footEle);

}

/**
 * Data Reload
 */
$('.ocs-reload__btn ').click((e) => {
    const $target = $(e.target);

    /**
     * 기존 데이터 제거
     */
    $('table tbody').empty();
    $('.floated .pagination').empty();
    /**
     * reload
     */
    if ($target.hasClass('now')) {
        getOcsData();
    } else {
        getOcsData('before');
    }
})


/**
 * Excel Download
 * 금일 OCS 자료만 뽑아가도록.
 */
$('.ocs-excel').click((e) => { 
    location.href = '/ocs/excel'; 
})
init();