import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import moment from 'moment';

const showAndHide = (rowsClass, newId) => {
    const rows = $(`.${rowsClass}`);
    const findRow = _.find(rows, row => $(row).is(':visible'));
    const { id: findId = "" } = findRow;
    if (!_.eq(findId, newId)) {
        $(`.${rowsClass}`).hide()
        $(`#${newId}`).show()
    }
}

$('#pastDiagnosisRecord').on('click', () => {
    $('.ui.sidebar').sidebar('toggle');
})

$(document).on('click', '.past-diagnosis-item', (e) => {

    //TODO show modal(large + 엑스바) 로직 및 modal에서 페이지로 가져오기
    const chartId = e.target.id
    const patientId = $(e.target).attr('patient')
    const chartNumber = $(e.target).attr('chartNumber')

    getPastChart(chartId, patientId, chartNumber)

    $('.past-chart-modal').modal('show');

    /**
     * show and hide 함수 적용 범위때문에 일단 showAndHide 함수 2회 호출로 임시 처리
     * 향후에 성능 개선 필요
     */
    showAndHide('past-hide-and-show-row', 'past-chart-pre-diagnosis-container');
    showAndHide('past-hide-and-show-row', 'past-chart-diagnosis-container');
})

$(document).on('click', '#get-past-chart', () => {
    $('.past-chart-modal').modal('hide');
    $('.ui.sidebar').sidebar('toggle');
})

function getPastChart(id, patient, chartNumber) {

  http
      .getMethod(`/chart/detail/${id}/${patient}/${chartNumber}`)
      .then((result) => {

          const { data, code } = result;
          if (!_.eq(code, resultCode.success)) {
              return Promise.reject('fail past chart data');
          }
          return Promise.resolve(data[0]);

      }).then(data => renderOriginalDiagnosis(data))
        .catch((error) => {
          console.log(error)
          return $.uiAlert({
            textHead: '[ERROR-CODE 6002]',
            text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
            bgcolor: '#F2711C',
            textcolor: '#fff',
            position: 'top-center',
            time: 5,
          })
      })
}

function renderOriginalDiagnosis(data) {

  console.log(data)
  $('#preChartId').val(data.chartNumber);
  $('#preName').val(data.patient.name);
  $('#past-originChartId').val(data.chartNumber);
  $('#past-originName').val(data.patient.name);
  // 차트 번호, 이름 화면 렌더링

  $('#heartRate').val(data.heartRate);
  $('#pulseRate').val(data.pulseRate);
  $('#bodyTemporature').val(data.bodyTemporature);
  $('#systoleBloodPressure').val(data.systoleBloodPressure);
  $('#diastoleBloodPressure').val(data.diastoleBloodPressure);
  $('#bloodGlucose').val(data.bloodGlucose);
  $('#originName').val(data.patient.name);
  $('#mealTerm').val(data.mealTerm + '시간');
  // 예진 정보 화면 렌더링
}

function getPastChartList(patient) {

  const patientId = patient

  http
      .getMethod(`/chart/past/${patientId}`)
      .then((result) => {
          const { data, code } = result;

          if (!_.eq(code, resultCode.success)) {
              return Promise.reject('fail past chart list data');
          }
          return Promise.resolve(data);

      }).then(datas => {

        $('.past-diagnosis-list').empty()
        $('.past-diagnosis-list').append(
          _.map(datas, data => {
              const { chartNumber, patient_id, id } = data;
              const pastChart = String(chartNumber).substring(0, 4) + '년 ' + String(chartNumber).substring(4, 6) + '월 ' + String(chartNumber).substring(6, 8) + '일 진료 기록'
              return `<a id="${id}" patient="${patient_id}" chartNumber="${chartNumber}" class="item past-diagnosis-item">
                        <div id="${id}" patient="${patient_id}" chartNumber="${chartNumber}" class="content">[${pastChart}]</div>
                      </a>`
          })
        )
      }).catch((error) => {

        console.log(error)
        return $.uiAlert({
          textHead: '[ERROR-CODE 6001]',
          text: '시스템에 문제가 발생하였습니다! 아이티 본부 단원에게 위 에러 코드를 전달해주세요.',
          bgcolor: '#F2711C',
          textcolor: '#fff',
          position: 'top-center',
          time: 5,
        })
      })
}

module.exports = {
    getPastChartList
}
