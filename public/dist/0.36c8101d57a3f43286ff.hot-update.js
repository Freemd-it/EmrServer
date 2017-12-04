webpackHotUpdate(0,{

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)('#waitingList').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '1'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('show');
});

(0, _jquery2.default)(document).on('click', '.table-content', function (e) {

    // console.log(e.target);
    var docs = {
        chartNumber: e.target.id
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        (0, _jquery2.default)('#preChartId').val(result.chartNumber);
        (0, _jquery2.default)('#preName').val(result.patient.name);

        (0, _jquery2.default)('#getPastCC').attr('disabled', false);
        (0, _jquery2.default)('#pastDiagnosisRecord').attr('disabled', false);
        (0, _jquery2.default)('#vitalSign').attr('disabled', false);
        (0, _jquery2.default)('#pharmacopoeia').attr('disabled', false);
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('hide');
});

(0, _jquery2.default)(document).on('click', '.negative.send.ui.button', function () {
    var heartRate = (0, _jquery2.default)('#heartRate').val();
    var pulseRate = (0, _jquery2.default)('#pulseRate').val();
    var bodyTemporature = (0, _jquery2.default)('#bodyTemporature').val();
    var systoleBloodPressure = (0, _jquery2.default)('#systoleBloodPressure').val();
    var diastoleBloodPressure = (0, _jquery2.default)('#diastoleBloodPressure').val();
    var bloodGlucose = (0, _jquery2.default)('#bloodGlucose').val();
    var mealTerm = (0, _jquery2.default)('#mealTerm').val();
    var chartNumber = (0, _jquery2.default)('#preChartId').val();
    var ccData = (0, _jquery2.default)('#CCform').serializeArray();

    var docs = {
        heartRate: heartRate,
        pulseRate: pulseRate,
        bodyTemporature: bodyTemporature,
        systoleBloodPressure: systoleBloodPressure,
        diastoleBloodPressure: diastoleBloodPressure,
        bloodGlucose: bloodGlucose,
        mealTerm: mealTerm,
        chartNumber: chartNumber,
        ccArray: JSON.stringify(ccData),
        updateStatus: 2
    };

    _jquery2.default.ajax({
        type: 'POST',
        url: 'http://localhost:3000/chart/update',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        if (result.length == 1) {
            (0, _jquery2.default)('#chartForm, #CCform').each(function () {
                this.reset();
            });

            if ((0, _jquery2.default)('#CCsegment').children().length > 0) {
                (0, _jquery2.default)('#CCsegment *').remove();
            }

            (0, _jquery2.default)('#getPastCC').attr('disabled', true);

            _jquery2.default.uiAlert({
                textHead: '[알림]',
                text: '차트번호 ' + chartNumber + ' 예진 완료되었습니다.',
                bgcolor: '#19c3aa',
                textcolor: '#fff',
                position: 'top-left',
                time: 2
            });

            return 0;
        }
    });
});

(0, _jquery2.default)('#CCbutton').on('click', function () {
    var ref = (0, _jquery2.default)('#CCsegment').children().length;

    (0, _jquery2.default)('#CCsegment').append(' <div class="inner-div">\n            <button type="button" class="ui red inverted button" style="margin-bottom: 1%">\uC0AD\uC81C</button>\n            <div class="sixteen wide column">\n                    <div class="ui fluid input focus">\n                        <input name="CC ' + ref + '" type="text" placeholder="C.C">\n                    </div>\n\n                    <div class="ui form" style="margin-top: 1%">\n                        <div class="field">\n                            <textarea name="HistoryOfCC ' + ref + '" rows="3" placeholder="History of C.C"></textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>');
});

(0, _jquery2.default)('#getPastCC').on('click', function () {

    var chartId = (0, _jquery2.default)('#preChartId').val();
    var docs = {
        chartId: chartId
    };

    if ((0, _jquery2.default)('#tablePastBody').children().length) (0, _jquery2.default)('#tablePastBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart/pastAll',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tablePastBody').append('<tr id=' + result[i].chartNumber + ' class="tablecontent">\n                        <td id=' + result[i].chartNumber + '>' + result[i].chartNumber + '</td>\n                        <td id=' + result[i].chartNumber + '>' + result[i].createdAt + '</td>\n                 </tr>');
        }
    });

    (0, _jquery2.default)('.ui.past.modal').modal('show');
});

(0, _jquery2.default)(document).on('click', '.tbody-content', function (e) {

    var chartNumber = e.target.id;

    var docs = {
        chartNumber: chartNumber
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/chart/pastOne',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        for (var i = 0; i < result.complaints.length; i++) {
            (0, _jquery2.default)('#modalPastCC').append('<div class="inner-div">\n                    <button type="button" class="ui red inverted button" style="margin-bottom: 1%" disabled>\uC0AD\uC81C</button\n                    <div class="sixteen wide column">\n                        <div class="ui fluid input focus">\n                            <input name="CC ' + i + '" type="text" value=\'' + result.complaints[i].chiefComplaint + '\' disabled>\n                        </div>\n\n                        <div class="ui form" style="margin-top: 1%">\n                            <div class="field">\n                                <textarea name="HistoryOfCC ' + i + '" rows="3" disabled>' + result.complaints[i].chiefComplaintHistory + '</textarea>\n                            </div>\n                        </div>\n                    </div>\n                </div>');
        };
    });

    (0, _jquery2.default)('.ui.cc.modal').modal('show');
});

(0, _jquery2.default)('#copyButton').on('click', function () {

    (0, _jquery2.default)('#firstCC').remove();

    (0, _jquery2.default)("#modalPastCC :input").prop("disabled", false);

    var clone = (0, _jquery2.default)('#modalPastCC').children().clone();

    if ((0, _jquery2.default)('#CCsegment').children().length) {

        (0, _jquery2.default)('#CCsegment *').remove();
    }

    (0, _jquery2.default)('#CCsegment').append(clone);

    (0, _jquery2.default)('.ui.cc.modal').modal('hide');

    (0, _jquery2.default)('#modalPastCC *').remove();
});

(0, _jquery2.default)(document).on('click', '.ui.red.inverted', function (e) {

    e.target.parentNode.remove();
});

/***/ })

})