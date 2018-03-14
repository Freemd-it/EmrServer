import _ from 'lodash';
import http from '../utils/http';
import { resultCode } from '../utils/constant';
import moment from 'moment';

$('#pastDiagnosisRecord').on('click', () => {
    $('.ui.sidebar').sidebar('toggle')
})

$(document).on('click', '.past-diagnosis-item', (e) => {
    //TODO show modal(large + 엑스바) 로직 및 modal에서 페이지로 가져오기
    console.log(e.target)
    $('.ui.longer.modal.pharmacopoeia').modal('show')
})

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
              return `<a chart-id="${id}" class="item past-diagnosis-item">
                        <div chart-id="${id}" class="content">[${pastChart}]</div>
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
