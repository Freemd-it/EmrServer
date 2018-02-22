import moment from 'moment'

function init() {
    if (!_.eq(location.pathname, '/management')) return;
    setDatePicker();
    wow();
    // $('#startTime').val(moment().format(''))
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

function wow() {
  var arr = '[{"medicine_id":"8","chartNumber":"2018022203","medicineName":"트리돌서방정","medicineIngredient":"Tramadol HCl 100mg","doses":"1","dosesCountByDay":"qd","dosesDay":"1","remarks":""},{"medicine_id":"9","chartNumber":"2018022203","medicineName":"벤자민정","medicineIngredient":"Cyclobenzaprine HCl 10mg","doses":"2","dosesCountByDay":"bid","dosesDay":"2","remarks":""},{"medicine_id":"10","chartNumber":"2018022203","medicineName":"손페리정","medicineIngredient":"Eperisone HCl 50mg","doses":"3","dosesCountByDay":"tid","dosesDay":"3","remarks":""},{"medicine_id":"10","chartNumber":"2018022203","medicineName":"손페리정","medicineIngredient":"Eperisone HCl 50mg","doses":"4","dosesCountByDay":"hs","dosesDay":"4","remarks":""}]';
  console.log(arr)
  var arr2 = JSON.parse(arr)
  // console.log(arr2)
  // console.log(JSON.stringify(arr2))
  // console.log(arr)
  arr2.forEach((data) => {
    data.useTotal = data.doses * statusConvert(data.dosesCountByDay) * data.dosesDay
  })
  var arr = JSON.stringify(arr2)
  console.log(arr)

  // for (var i in arr) {
  //   arr[i].useTotal = arr[i].doses * statusConvert(arr[i].dosesCountByDay) * arr[i].dosesDay
  // }
  // console.log(arr)
}

function statusConvert (param) {
  switch (param) {
    case 'qd' : return 1; break;
    case 'bid' : return 2; break;
    case 'tid' : return 3; break;
    case 'hs' : return 4; break;
  }
}

init();
