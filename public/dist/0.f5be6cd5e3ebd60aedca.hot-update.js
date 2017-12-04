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

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tableRenderMedicine = [];

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

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/list',
        dataType: 'json',
        cache: false
    }).done(function (result) {

        window.localStorage.setItem('medicine', JSON.stringify(result));
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
        (0, _jquery2.default)('.main-category-select > select').append('<option class=\'default\' value=\'\'>\uB300\uBD84\uB958</option>');
    }

    if ((0, _jquery2.default)('.small-category-select > select').children().length) {
        (0, _jquery2.default)('.small-category-select > select *').remove();
        (0, _jquery2.default)('.small-category-select > select').append('<option class=\'default\' value=\'\'>\uC18C\uBD84\uB958</option>');
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
    (0, _jquery2.default)('.ui.longer.modal.pharmacopoeia').modal('show');
});

(0, _jquery2.default)('.main-category-select').change(function () {
    var param = {
        primaryCategory: (0, _jquery2.default)('.main-category-select option:selected').attr('value')
    };

    if ((0, _jquery2.default)('.small-category-select > select').children().length) {
        (0, _jquery2.default)('.small-category-select > select *').remove();
        (0, _jquery2.default)('.small-category-select > select').append('<option class=\'default\' value=\'\'>\uC18C\uBD84\uB958</option>');
    }

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/category/small',
        data: param,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        for (i in result) {
            if (i === '0') {

                (0, _jquery2.default)('.small-category-select > select').nextAll('div.text').text('' + result[i].secondaryCategory);

                (0, _jquery2.default)('.small-category-select > select').append('<option selected value=\'' + result[i].secondaryCategory + '\'> ' + result[i].secondaryCategory + ' </option>');
                var medicine = JSON.parse(window.localStorage.getItem('medicine'));
                var categoryMain = (0, _jquery2.default)('.main-category-select option:selected').text();
                var categorySmall = (0, _jquery2.default)('.small-category-select option:selected').text();
                tableRenderMedicine = [];

                medicine.find(function (x) {
                    if (_jquery2.default.trim(x.primaryCategory) === _jquery2.default.trim(categoryMain) && _jquery2.default.trim(x.secondaryCategory) === _jquery2.default.trim(categorySmall)) {
                        tableRenderMedicine.push(x);
                    }
                });

                if ((0, _jquery2.default)('#medicineTableBody').children().length) (0, _jquery2.default)('#medicineTableBody *').remove();

                for (var i = 0; i < tableRenderMedicine.length; i++) {
                    (0, _jquery2.default)('#medicineTableBody').append('<tr id=' + tableRenderMedicine[i].id + ' class=\'pharmacopoeia-hover\'>\n                       <td>' + tableRenderMedicine[i].name + '</td>\n                       <td>' + tableRenderMedicine[i].ingredient + '</td>\n                       <td>' + tableRenderMedicine[i].medication + '</td>\n                       <td>' + tableRenderMedicine[i].property + '</td>\n                </tr>');
                }
            } else {
                (0, _jquery2.default)('.small-category-select > select').append('<option value=\'' + result[i].secondaryCategory + '\'> ' + result[i].secondaryCategory + ' </option>');
            }
        }
    });
});

(0, _jquery2.default)('.small-category-select').change(function () {
    var medicine = JSON.parse(window.localStorage.getItem('medicine'));
    var categoryMain = (0, _jquery2.default)('.main-category-select option:selected').text();
    var categorySmall = (0, _jquery2.default)('.small-category-select option:selected').text();
    tableRenderMedicine = [];

    medicine.find(function (x) {
        if (_jquery2.default.trim(x.primaryCategory) === _jquery2.default.trim(categoryMain) && _jquery2.default.trim(x.secondaryCategory) === _jquery2.default.trim(categorySmall)) {
            tableRenderMedicine.push(x);
        }
    });

    if ((0, _jquery2.default)('#medicineTableBody').children().length) (0, _jquery2.default)('#medicineTableBody *').remove();

    for (var i = 0; i < tableRenderMedicine.length; i++) {
        (0, _jquery2.default)('#medicineTableBody').append('<tr id=' + tableRenderMedicine[i].id + ' class=\'pharmacopoeia-hover\'>\n               <td>' + tableRenderMedicine[i].name + '</td>\n               <td>' + tableRenderMedicine[i].ingredient + '</td>\n               <td>' + tableRenderMedicine[i].medication + '</td>\n               <td>' + tableRenderMedicine[i].property + '</td>\n        </tr>');
    }
});

(0, _jquery2.default)('.pharmacySearchButton').on('click', function () {

    (0, _jquery2.default)('.main-category-select > select > .default').attr('selected', 'selected');
    (0, _jquery2.default)('.small-category-select > select > .default').attr('selected', 'selected');
    (0, _jquery2.default)('.main-category-select > select').nextAll('div.text').text('대분류');
    (0, _jquery2.default)('.small-category-select > select').nextAll('div.text').text('소분류');

    var searchText = (0, _jquery2.default)('input[name=medicineSearchText]').val();
    var option = (0, _jquery2.default)('.medicineSearchSelect option:selected').val();
    var param = {
        searchText: searchText,
        option: option
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/medicine/search',
        data: param,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        if ((0, _jquery2.default)('#medicineTableBody').children().length) (0, _jquery2.default)('#medicineTableBody *').remove();

        for (var i in result) {
            (0, _jquery2.default)('#medicineTableBody').append('<tr id=' + result[i].id + ' class=\'pharmacopoeia-hover\'>\n                 <td>' + result[i].name + '</td>\n                 <td>' + result[i].ingredient + '</td>\n                 <td>' + result[i].medication + '</td>\n                 <td>' + result[i].property + '</td>\n          </tr>');
        }
    });
});

(0, _jquery2.default)(document).on('click', '.pharmacopoeia-hover', function (e) {

    if ((0, _jquery2.default)('#prescriptionTableBody .defaultPrescriptionTableBody').length) (0, _jquery2.default)('#prescriptionTableBody .defaultPrescriptionTableBody').remove();

    JSON.parse(window.localStorage.getItem('medicine')).find(function (x) {
        if (x.id === Number(e.currentTarget.id)) {
            (0, _jquery2.default)('#prescriptionTableBody').append('<tr id=' + x.id + '\'>\n               <td>' + x.name + '</td>\n               <td>' + x.ingredient + '</td>\n               <td><input /></td>\n               <td><input /></td>\n               <td><input /></td>\n               <td><input /></td>\n               <td class="deletePrescriptionTD">\n                <i class="sign out icon delete-icon-size deleteTargetByIcon"></i>\n               </td>\n         </tr>');
            _jquery2.default.uiAlert({
                textHead: 'INFO', // header
                text: '처방전에 ' + x.name + '이(가) 추가되었습니다.', // Text
                bgcolor: '#55a9ee', // background-color
                textcolor: '#fff', // color
                position: 'top-left', // position . top And bottom ||  left / center / right
                time: 2 // time
            });
            // console.log(x);
        }
    });
});

(0, _jquery2.default)(document).on('click', '.deleteTargetByIcon', function (e) {
    (0, _jquery2.default)(e.target).parent().parent().remove();
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

__webpack_require__(36);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(37);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(11);

__webpack_require__(12);

__webpack_require__(13);

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

$.uiAlert = function (options) {
  var setUI = $.extend({
    textHead: 'Your user registration was successful.',
    text: 'You may now log-in with the username you have chosen',
    textcolor: '#19c3aa',
    bgcolors: '#fff',
    position: 'top-right',
    icon: '',
    time: 5,
    permanent: false
  }, options);

  var ui_alert = 'ui-alert-content';
  ui_alert += '-' + setUI.position;
  setUI.bgcolors = 'style="background-color: ' + setUI.bgcolor + ';   box-shadow: 0 0 0 1px rgba(255,255,255,.5) inset,0 0 0 0 transparent;"';
  if (setUI.bgcolors === '') setUI.bgcolors = 'style="background-color: ; box-shadow: 0 0 0 1px rgba(255,255,255,.5) inset,0 0 0 0 transparent;"';
  if (!$('body > .' + ui_alert).length) {
    $('body').append('<div class="ui-alert-content ' + ui_alert + '" style="width: inherit;"></div>');
  }
  var message = $('<div id="messages" class="ui icon message" ' + setUI.bgcolors + '><i class="' + setUI.icon + ' icon" style="color: ' + setUI.textcolor + ';"></i><i class="close icon" style="color: ' + setUI.textcolor + ';" id="messageclose"></i><div style="color: ' + setUI.textcolor + '; margin-right: 10px;">   <div class="header">' + setUI.textHead + '</div>  <p> ' + setUI.text + '</p></div>  </div>');
  $('.' + ui_alert).prepend(message);
  message.animate({
    opacity: '1'
  }, 300);
  if (setUI.permanent === false) {
    var timer = 0;
    $(message).mouseenter(function () {
      clearTimeout(timer);
    }).mouseleave(function () {
      uiAlertHide();
    });
    uiAlertHide();
  }
  function uiAlertHide() {
    timer = setTimeout(function () {
      message.animate({
        opacity: '0'
      }, 300, function () {
        message.remove();
      });
    }, setUI.time * 1000);
  }

  $('#messageclose').on('click', function () {
    $(this).closest('#messages').transition('fade');
  });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })

})