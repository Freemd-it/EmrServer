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

function getPastChart(id, patient, chartNumber) {

  http
      .getMethod(`/chart/detail/${id}/${patient}/${chartNumber}`)
      .then((result) => {

          const { data, code } = result;
          if (!_.eq(code, resultCode.success)) {
              return Promise.reject('fail past chart data');
          }
          return Promise.resolve(data[0]);

      }).then(renderPastOriginalDiagnosis)
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

function renderPastOriginalDiagnosis(data) {

  // console.log(data)

  $('#past-originChartId').val(data.chartNumber);
  $('#past-originName').val(data.patient.name);
  $('.past-impression').val(data.impression);
  $('.past-presentIllness').val(data.presentIllness);
  $('.past-treatmentNote').val(data.treatmentNote);

  $('#past-prescription-table-body').empty();
  $('#past-prescription-table-body').append(
      _.map(data.prescriptions, data => {
        const { id, medicineName, medicineIngredient, doses, dosesCountByDay, dosesDay, remarks } = data;
        return ` <tr prescription-id="${id}" class="ui fluid">
          <td>${medicineName}</td>
          <td>${medicineIngredient}</td>
          <td>${doses}</td>
          <td>${dosesCountByDay}</td>
          <td>${dosesDay}</td>
          <td>${remarks === '' ? '-' : remarks}</td>
        </tr>`
      })
  );
  // 본진 정보 렌더링

  $('#past-preChartId').val(data.chartNumber);
  $('#past-preName').val(data.patient.name);
  $('#past-heartRate').val(data.heartRate);
  $('#past-pulseRate').val(data.pulseRate);
  $('#past-bodyTemporature').val(data.bodyTemporature);
  $('#past-systoleBloodPressure').val(data.systoleBloodPressure);
  $('#past-diastoleBloodPressure').val(data.diastoleBloodPressure);
  $('#past-bloodGlucose').val(data.bloodGlucose);
  $('#past-mealTerm').val(data.mealTerm + '시간');

  $('#past-originalDiagnosisCCsegment').empty();
  $('#past-originalDiagnosisCCsegment').append(
      _.map(data.complaints, data => {
        const { chiefComplaint, chiefComplaintHistory } = data;
        return ` <div class="inner-div" style="border-color: #ddd;">
          <div class="sixteen wide column">
                  <div class="ui fluid input focus">
                      <input type="text" placeholder="C.C" value="${chiefComplaint}" />
                  </div>

                  <div class="ui form" style="margin-top: 1%">
                      <div class="field">
                          <textarea rows="3" placeholder="History of C.C">${chiefComplaintHistory}</textarea>
                      </div>
                  </div>
              </div>
          </div>`
      })
  );
  // 예진 정보 렌더링

  $('#get-past-chart').on('click', () => {

      renderOriginalDiagnosis(data);
      $('.past-chart-modal').modal('hide');
      $('.ui.sidebar').sidebar('toggle');
  })
  /**
   * @description 이게 중복으로 호출되는 문제가 발생하고 있음
   * 결과적으로 동작에 문제는 없지만
   * 차 후에 로컬 스토리지를 이용하는 방식? 처럼 다른 방식으로 변경할 필요 있음
   * 아님 커링을 이용?
   */
}

function renderOriginalDiagnosis(data) {

  const pastChart = String(data.chartNumber).substring(0, 4) + '년 ' + String(data.chartNumber).substring(4, 6) + '월 ' + String(data.chartNumber).substring(6, 8) + '일 진료 정보'

  if ($('#prescription-table-body .defaultPrescriptionTableBody').length)
    $('#prescription-table-body .defaultPrescriptionTableBody').remove();

  $('#prescription-table-body').empty();

  $('#originChartId').val(data.chartNumber);
  $('#originName').val(data.patient.name);
  $('.impression').val(data.impression);
  $('.presentIllness').val(data.presentIllness);
  $('.treatmentNote').val(data.treatmentNote);

  $('#prescription-table-body').append(`<tr></tr>`);
  $('#prescription-table-body').append(
      _.map(data.prescriptions, data => {
        const { id, medicineName, medicineIngredient, doses, dosesCountByDay, dosesDay, remarks } = data;
        return `<tr id=${data.medicine_id}>
               <td>${data.medicineName}</td>
               <td>${data.medicineIngredient}</td>
               <td><input name="currentDoses" value="${data.doses}" /></td>
               <td width="10%">
                 <select class="doses-for-day">
                    <option value="qd" ${data.dosesCountByDay === 'qd' ? 'selected' : ''}>qd</option>
                    <option value="bid" ${data.dosesCountByDay === 'bid' ? 'selected' : ''}>bid</option>
                    <option value="tid" ${data.dosesCountByDay === 'tid' ? 'selected' : ''}>tid</option>
                    <option value="hs" ${data.dosesCountByDay === 'hs' ? 'selected' : ''}>hs</option>
                 </select>
               </td>
               <td><input name="currentDosesDay" value="${data.dosesDay}" /></td>
               <td><input name="currentRemarks" value="${data.remarks}"/></td>
               <td class="deletePrescriptionTD">
                 <i class="sign out icon delete-icon-size deleteTargetByIcon"></i>
               </td>
         </tr>`
      })
  );

  $('.doses-for-day').addClass('ui search fluid dropdown');
  $('.doses-for-day.dropdown').dropdown();

  // return $.uiAlert({
  //   textHead: '[알림]',
  //   text: pastChart + '를 복사하였습니다.',
  //   bgcolor: '#55a9ee',
  //   textcolor: '#fff',
  //   position: 'top-left',
  //   time: 3
  // })
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
