webpackHotUpdate(0,{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 이름으로 조회
 */
(0, _jquery2.default)('#btn-name-send').on('click', function () {
    var name = _jquery2.default.trim((0, _jquery2.default)('#nameInput').val());
    var docs = void 0;
    var date = void 0;
    var idx = 1;

    (0, _jquery2.default)('#name').attr({
        disabled: false
    });

    (0, _jquery2.default)('#birth').attr({
        disabled: false
    });

    (0, _jquery2.default)('.ui.dropdown').removeClass("disabled");

    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    docs = {
        name: name
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/receipt/patients',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {

        console.log(result);
        if (!result.length) {

            (0, _jquery2.default)('#nameMessage').html('[ ' + name + ' ]' + ' 님에 대한 정보가 없습니다.');

            (0, _jquery2.default)('#message').attr({
                class: 'ui negative message',
                hidden: false
            });

            setTimeout(function () {
                (0, _jquery2.default)('#message').closest('.message').transition('fade');
            }, 1000);

            (0, _jquery2.default)('#nameInput').val('');
            (0, _jquery2.default)('#name').val(name);
            (0, _jquery2.default)('#height').val('');
            (0, _jquery2.default)('#weight').val('');
            (0, _jquery2.default)('#drinking').val('');
            (0, _jquery2.default)('#smoking').val('');
            (0, _jquery2.default)('#birth').val('');
            (0, _jquery2.default)('#smokingPeriod').val('');
            (0, _jquery2.default)('#drinkingPeriod').val('');
            (0, _jquery2.default)('#bmi').val('');
            (0, _jquery2.default)('#diseaseDescription').val('');
            (0, _jquery2.default)('#allergyDescription').val('');
            (0, _jquery2.default)('input[name="pastMedical"][value="Y"]').prop("checked", true).trigger("change");
            (0, _jquery2.default)('input[name="pastMedication"][value="Y"]').prop("checked", true).trigger("change");
            (0, _jquery2.default)('input[name="pastMedicationDescription"]').val('');
            (0, _jquery2.default)('input[name="pastMedicalDescription"]').val('');

            date = new Date();
            (0, _jquery2.default)('#firstcome').val(date.getFullYear() + ' 년 ' + (date.getMonth() + 1) + ' 월 ' + date.getDate() + ' 일 ');

            for (idx; idx < 12; idx++) {
                var id = '#disease' + idx;
                var id2 = '#allergy' + idx;

                (0, _jquery2.default)(id).prop("checked", false);
                (0, _jquery2.default)(id2).prop("checked", false);
            }
            idx = 1;

            return;
        }

        if (result.length == 1) {

            (0, _jquery2.default)('#nameMessage').html('[ ' + result[0].name + ' ]' + ' 님이 조회됐습니다.');

            (0, _jquery2.default)('#message').attr({
                class: 'ui positive message',
                hidden: false
            });

            setTimeout(function () {
                (0, _jquery2.default)('#message').closest('.message').transition('fade');
            }, 1000);

            (0, _jquery2.default)('#nameInput').val('');

            (0, _jquery2.default)('#name').attr("disabled", true).val(result[0].name);

            (0, _jquery2.default)('#height').val(result[0].height);

            (0, _jquery2.default)('#weight').val(result[0].weight);

            (0, _jquery2.default)('#drinking').val(result[0].smokingAmount);

            (0, _jquery2.default)('#smoking').val(result[0].drinkingAmount);

            (0, _jquery2.default)('#smokingPeriod').val(result[0].smokingPeriod);

            (0, _jquery2.default)('#drinkingPeriod').val(result[0].drinkingPeriod);
            (0, _jquery2.default)('#bmi').val(result[0].bmi);

            date = new Date(result[0].firstVisit).toISOString().slice(0, 10);

            (0, _jquery2.default)('#firstcome').val(date);

            date = new Date(result[0].birth).toISOString().slice(0, 10);

            (0, _jquery2.default)('#birth').attr("disabled", true).val(date);

            (0, _jquery2.default)('#gender').dropdown('set selected', result[0].gender);

            (0, _jquery2.default)('.ui.dropdown').addClass("disabled");

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = result[0].histories[0].pastHistory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    var _id = '#disease' + idx;
                    if (i == 1) {
                        (0, _jquery2.default)(_id).prop("checked", true);
                    }
                    idx++;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            idx = 1;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = result[0].histories[0].allergy[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _i = _step2.value;

                    var _id2 = '#allergy' + idx;
                    if (_i == 1) {
                        (0, _jquery2.default)(_id2).prop("checked", true);
                    }
                    idx++;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var value = result[0].histories[0].pastMedical;

            (0, _jquery2.default)('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");

            (0, _jquery2.default)('#pastMedicalTime').val(result[0].histories[0].pastMedicalTime);
            (0, _jquery2.default)('#pastMedicalArea').val(result[0].histories[0].pastMedicalArea);

            value = result[0].histories[0].pastMedication;

            (0, _jquery2.default)('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");

            (0, _jquery2.default)('#pastMedicationPeriod').val(result[0].histories[0].pastMedicationPeriod);
            (0, _jquery2.default)('#pastMedicationType').val(result[0].histories[0].pastMedicationType);

            (0, _jquery2.default)('#diseaseDescription').val(result[0].histories[0].pastHistoryComment);

            (0, _jquery2.default)('#allergyDescription').val(result[0].histories[0].allergyComment);
        } else {

            (0, _jquery2.default)('#nameInput').val('');

            if ((0, _jquery2.default)('#list').children().length) (0, _jquery2.default)('#list *').remove();

            for (var _i2 = 0; _i2 < result.length; _i2++) {
                date = new Date(result[_i2].birth);
                (0, _jquery2.default)('#nameInput').val('');
                (0, _jquery2.default)('#list').append('  <div id=' + result[_i2].id + '  class="item" align="middle">\n' + '                    <div id=' + result[_i2].id + ' class="content">\n' + '                        <div id=' + result[_i2].id + ' class="header">' + result[_i2].name + '</div>\n' + '                        ' + date.getFullYear() + ' 년 ' + (date.getMonth() + 1) + ' 월 ' + date.getDate() + ' 일 ' + '                    </div>\n' + '                </div>');
            }

            (0, _jquery2.default)('.ui.basic.modal').modal('show');
        }
    });
});

/**
 * 동명이인 id로 조회
 */
(0, _jquery2.default)(document).on('click', '.item', function (e) {
    var date = void 0;
    var idx = 1;
    var docs = {
        id: e.target.id
    };

    _jquery2.default.ajax({
        type: 'GET',
        url: 'http://localhost:3000/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        console.log('#####');
        console.log(result);
        (0, _jquery2.default)('#nameMessage').html('[ ' + result.name + ' ]' + ' 님이 조회됐습니다.');

        (0, _jquery2.default)('#message').attr({
            class: 'ui positive message',
            hidden: false
        });

        setTimeout(function () {
            (0, _jquery2.default)('#message').closest('.message').transition('fade');
        }, 1000);

        (0, _jquery2.default)('#nameInput').val('');

        (0, _jquery2.default)('#name').attr("disabled", true).val(result.name);

        (0, _jquery2.default)('#height').val(result.height);

        (0, _jquery2.default)('#weight').val(result.weight);

        (0, _jquery2.default)('#drinking').val(result.smokingAmount);

        (0, _jquery2.default)('#smoking').val(result.drinkingAmount);

        (0, _jquery2.default)('#smokingPeriod').val(result.smokingPeriod);

        (0, _jquery2.default)('#drinkingPeriod').val(result.drinkingPeriod);

        (0, _jquery2.default)('#bmi').val(result.bmi);

        date = new Date(result.firstVisit).toISOString().slice(0, 10);

        (0, _jquery2.default)('#firstcome').val(date);

        date = new Date(result.birth).toISOString().slice(0, 10);

        (0, _jquery2.default)('#birth').attr("disabled", true).val(date);

        (0, _jquery2.default)('#gender').dropdown('set selected', result.gender);

        (0, _jquery2.default)('.ui.dropdown').addClass("disabled");

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = result.histories[0].pastHistory[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var i = _step3.value;

                var id = '#disease' + idx;
                if (i == 1) {
                    (0, _jquery2.default)(id).prop("checked", true);
                }
                idx++;
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        idx = 1;
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = result.histories[0].allergy[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _i3 = _step4.value;

                var _id3 = '#allergy' + idx;
                if (_i3 == 1) {
                    (0, _jquery2.default)(_id3).prop("checked", true);
                }
                idx++;
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        var value = result.histories[0].pastMedical;

        (0, _jquery2.default)('input[name="pastMedical"][value=' + value + ']').prop('checked', true).trigger("change");

        (0, _jquery2.default)('#pastMedicalTime').val(result.histories[0].pastMedicalTime);
        (0, _jquery2.default)('#pastMedicalArea').val(result.histories[0].pastMedicalArea);

        value = result.histories[0].pastMedication;

        (0, _jquery2.default)('input[name="pastMedication"][value=' + value + ']').prop('checked', true).trigger("change");

        (0, _jquery2.default)('#pastMedicationPeriod').val(result.histories[0].pastMedicationPeriod);
        (0, _jquery2.default)('#pastMedicationType').val(result.histories[0].pastMedicationType);

        (0, _jquery2.default)('#diseaseDescription').val(result.histories[0].pastHistoryComment);

        (0, _jquery2.default)('#allergyDescription').val(result.histories[0].allergyComment);

        (0, _jquery2.default)('.ui.basic.modal').modal('hide');
    });
});

(0, _jquery2.default)('.ui.dropdown').dropdown();

(0, _jquery2.default)('.ui.checkbox').checkbox();

(0, _jquery2.default)('#weight, #height').change(function () {
    var weight = (0, _jquery2.default)('#weight').val();
    var height = (0, _jquery2.default)('#height').val() / 100;
    var bmi = weight / (height * height);

    (0, _jquery2.default)('#bmi').val(bmi.toFixed(5));
});

var getDiseaseHistory = function getDiseaseHistory() {
    var check = '';

    (0, _jquery2.default)('.disease').each(function () {
        (0, _jquery2.default)(this).is(':checked') ? check += "1" : check += "0";
    });

    return check;
};

var getAllergyHistory = function getAllergyHistory() {
    var check = '';

    (0, _jquery2.default)('.allergy').each(function () {
        (0, _jquery2.default)(this).is(':checked') ? check += "1" : check += "0";
    });

    return check;
};

(0, _jquery2.default)('input[name="pastMedical"]').on('change', function () {
    var type = (0, _jquery2.default)('input[name="pastMedical"]:checked').val();

    if (type === 'N') {
        (0, _jquery2.default)('#pastMedicalTime').prop('disabled', true);
        (0, _jquery2.default)('#pastMedicalArea').prop('disabled', true);
    }

    if (type === 'Y') {
        (0, _jquery2.default)('#pastMedicalTime').prop('disabled', false);
        (0, _jquery2.default)('#pastMedicalArea').prop('disabled', false);
    }
});

(0, _jquery2.default)('input[name="pastMedication"]').on('change', function () {
    var type = (0, _jquery2.default)('input[name="pastMedication"]:checked').val();

    if (type === 'N') {
        (0, _jquery2.default)('#pastMedicationPeriod').prop('disabled', true);
        (0, _jquery2.default)('#pastMedicationType').prop('disabled', true);
    }

    if (type === 'Y') {
        (0, _jquery2.default)('#pastMedicationPeriod').prop('disabled', false);
        (0, _jquery2.default)('#pastMedicationType').prop('disabled', false);
    }
});

(0, _jquery2.default)('#sendToPart2').on('click', function () {
    var docs = void 0;
    var name = (0, _jquery2.default)('#name').val();
    var birth = (0, _jquery2.default)('#birth').val();
    var height = (0, _jquery2.default)('#height').val();
    var weight = (0, _jquery2.default)('#weight').val();
    var BMI = (0, _jquery2.default)('#bmi').val();
    var gender = (0, _jquery2.default)('#gender').val();
    var smokingAmount = (0, _jquery2.default)('#smoking').val();
    var smokingPeriod = (0, _jquery2.default)('#smokingPeriod').val();
    var drinkingAmount = (0, _jquery2.default)('#drinking').val();
    var drinkingPeriod = (0, _jquery2.default)('#drinkingPeriod').val();
    var pastHistory = getDiseaseHistory();
    var pastHistoryComment = (0, _jquery2.default)('#diseaseDescription').val();
    var allergy = getAllergyHistory();
    var allergyComment = (0, _jquery2.default)('#allergyDescription').val();
    var pastMedical = (0, _jquery2.default)('input[name=pastMedical]:checked').val();
    var pastMedicalTime = (0, _jquery2.default)('#pastMedicalTime').val();
    var pastMedicalArea = (0, _jquery2.default)('#pastMedicalArea').val();
    var pastMedicationPeriod = (0, _jquery2.default)('#pastMedicationPeriod').val();
    var pastMedicationType = (0, _jquery2.default)('#pastMedicationType').val();
    var pastMedication = (0, _jquery2.default)('input[name=pastMedication]:checked').val();

    docs = {
        name: name,
        birth: birth,
        height: height,
        weight: weight,
        BMI: BMI,
        gender: gender,
        smokingAmount: smokingAmount,
        smokingPeriod: smokingPeriod,
        drinkingAmount: drinkingAmount,
        drinkingPeriod: drinkingPeriod,
        pastHistory: pastHistory,
        pastHistoryComment: pastHistoryComment,
        allergy: allergy,
        allergyComment: allergyComment,
        pastMedical: pastMedical,
        pastMedicalTime: pastMedicalTime,
        pastMedicalArea: pastMedicalArea,
        pastMedicationPeriod: pastMedicationPeriod,
        pastMedicationType: pastMedicationType,
        pastMedication: pastMedication
    };

    _jquery2.default.ajax({
        type: 'POST',
        url: 'http://localhost:3000/receipt/patient',
        data: docs,
        dataType: 'json',
        cache: false
    }).done(function (result) {
        window.scrollTo(0, 0);

        (0, _jquery2.default)('#patient_form').each(function () {
            this.reset();
        });

        console.log(result);
        _jquery2.default.uiAlert({
            textHead: 'COMPLETE',
            text: name + '님의 접수가 완료되었습니다.',
            bgcolor: '#19c3aa',
            textcolor: '#fff',
            position: 'top-left',
            time: 2
        });
        //todo 정상적으로 등록되었는지 어럴트, 정상적 등록시 적힌데이터 지우기
    });
});

/***/ })

})