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

    console.log("waitList Callback");
    console.log("waitList Callback");
    console.log("waitList Callback");

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('show');
});

(0, _jquery2.default)(document).on('click', '.table-content', function (e) {

    console.log(e.target);
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
        ccArray: JSON.stringify(ccData)
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
        console.log(result);
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

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)('.diagnosisWaitings').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        // console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                    <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                    <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)('.ui.longer.modal').modal('show');
    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.waitingTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '2'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".completeTab").removeClass("active");
    (0, _jquery2.default)(".waitingTab").addClass("active");
});

(0, _jquery2.default)('.completeTab').on('click', function () {

    if ((0, _jquery2.default)('#tableBody').children().length) (0, _jquery2.default)('#tableBody *').remove();

    var docs = {
        status: '1'
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: '/waitingList',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".waitingTab").removeClass("active");
    (0, _jquery2.default)(".completeTab").addClass("active");
});

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {
    if ((0, _jquery2.default)('#PharmacyOCSTableBody').children().length) (0, _jquery2.default)('#PharmacyOCSTableBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        dataType: 'json',
        cache: false
    }).done(function (result) {

        var convertStatus = '';

        for (var i = 0; i < result.length; i++) {

            convertStatus = getStatus(result[i].status);
            (0, _jquery2.default)('#PharmacyOCSTableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                   <td>' + result[i].name + '</td>\n                   <td>' + convertStatus + '</td>\n            </tr>');
        }
    });
});

(0, _jquery2.default)('.getPharmacyOCS').on('click', function () {

    if ((0, _jquery2.default)('#PharmacyOCSTableBody').children().length) (0, _jquery2.default)('#PharmacyOCSTableBody *').remove();

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/waitingList',
        dataType: 'json',
        cache: false
    }).done(function (result) {

        var convertStatus = '';

        for (var i = 0; i < result.length; i++) {

            convertStatus = getStatus(result[i].status);
            (0, _jquery2.default)('#PharmacyOCSTableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                   <td>' + result[i].name + '</td>\n                   <td>' + convertStatus + '</td>\n            </tr>');
        }
    });
});

(0, _jquery2.default)('#pharmacopoeia').on('click', function () {

    if ((0, _jquery2.default)('.main-category-select > select').children().length) {
        (0, _jquery2.default)('.main-category-select > select *').remove();
        (0, _jquery2.default)('.main-category-select > select').append('<option value=\'\'>\uB300\uBD84\uB958</option>');
    }

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/category/main',
        dataType: 'json',
        cache: false
    }).done(function (result) {
        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('.main-category-select > select').append('<option value=\'' + result[i].primaryCategory + '\'> ' + result[i].primaryCategory + ' </option>');
        }
    });
    (0, _jquery2.default)('.ui.longer.modal').modal('show');
});

(0, _jquery2.default)('.main-category-select').change(function () {
    var param = {
        primaryCategory: (0, _jquery2.default)('.main-category-select option:selected').attr('value')
    };

    if ((0, _jquery2.default)('.small-category-select > select').children().length) {
        (0, _jquery2.default)('.small-category-select > select *').remove();
        (0, _jquery2.default)('.small-category-select > select').append('<option value=\'\'>\uC18C\uBD84\uB958</option>');
    }

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/category/small',
        data: param,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        for (var i = 0; i < result.length; i++) {
            if (i === 0) {

                (0, _jquery2.default)('.small-category-select > select').nextAll('div.text').text('' + result[i].secondaryCategory);

                (0, _jquery2.default)('.small-category-select > select').append('<option selected value=\'' + result[i].secondaryCategory + '\'> ' + result[i].secondaryCategory + ' </option>');
            } else {
                (0, _jquery2.default)('.small-category-select > select').append('<option value=\'' + result[i].secondaryCategory + '\'> ' + result[i].secondaryCategory + ' </option>');
            }
        }
    });
});

function getStatus(status) {

    switch (status) {
        case 1:
            return '접수';break;
        case 2:
            return '예진';break;
        case 3:
            return '본진';break;
        case 4:
            return '대기';break;
        case 5:
            return '조제';break;
        case 6:
            return '완료';break;
    }
}

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

__webpack_require__(5);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(11);

__webpack_require__(12);

__webpack_require__(13);

/***/ }),

/***/ 36:
false,

/***/ 37:
false

})