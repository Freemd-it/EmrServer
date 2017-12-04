webpackHotUpdate(0,{

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

    (0, _jquery2.default)('.ui.longer.modal.waitingPatientList').modal('show');
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

        for (var i = 0; i < result.length; i++) {
            (0, _jquery2.default)('#tableBody').append('<tr id=' + result[i].chart_id + ' class="table-content">\n                       <td id=' + result[i].chart_id + '>' + result[i].chart_id + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].name + '</td>\n                       <td id=' + result[i].chart_id + '>' + result[i].birth + '</td>\n                </tr>');
        }
    });

    (0, _jquery2.default)(".waitingTab").removeClass("active");
    (0, _jquery2.default)(".completeTab").addClass("active");
});

(0, _jquery2.default)('#doctorSignedComplete').on('click', function () {

    var param = {
        chartNumber: (0, _jquery2.default)('#preChartId').val(),
        impression: (0, _jquery2.default)('.impression').val(),
        presentIllness: (0, _jquery2.default)('.presentIllness').val(),
        treatmentNote: (0, _jquery2.default)('.treatmentNote').val(),
        updateStatus: 3
    };

    console.log((0, _jquery2.default)('#prescriptionTableBody').children().length);

    console.log(param);
});

/***/ })

})