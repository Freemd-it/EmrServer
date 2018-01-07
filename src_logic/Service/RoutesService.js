var csurf = require('csurf');
var util = require('util');

var config = require('../../Config');
var userController = require('../Controller/UserController.js');
var authController = require('../Controller/AuthController.js');
var receiptController = require('../Controller/ReceiptController.js');
const waitingController = require('../Controller/WaitingController.js');
const chartController = require('../Controller/ChartController.js');
const viewsController = require('../Controller/ViewController.js');
const ocsController = require('../Controller/OcsController');
const medicineController = require('../Controller/MedicineController.js');
const loginController = require('../Controller/LoginController.js');
const prediagnosisController = require('../Controller/PrediagnosisController')
const pharmacyController = require('../Controller/PharmacyController');
const originalDiagnosisController = require('../Controller/OriginalDiagnosisController');
const managementController = require('../Controller/ManagementController');
const prescriptionController = require('../Controller/PrescriptionController');


var csrfProtection = new csurf({ cookie: true });

var RoutesService = function () { };

RoutesService.Init = function () {

    if (app.get('env') === 'production') {

        app.use(csrfProtection);
        console.log(util.format('Use Middleware csrf'));
    }

    app.use(function log(req, res, next) {

        res.header('Access-Control-Allow-Origin', config.server.accept_domain);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    /* 테스트 화면 출력용 */
    app.get('/', (req, res, callback) => {

        res.render('index')
        // var height = "175";
        // var weight = "60";
        // var result = (Number(weight) / (Number(height / 100) * Number(height / 100))).toFixed(1);
        // result = new Date();

        // res.status(200).json({ "result" : result });

    });
    app.use('/login',loginController);
    app.use('/user', userController);
    app.use('/auth', authController);
    app.use('/ocs', ocsController);
    app.use('/receipt', receiptController);
    app.use('/prediagnosis',prediagnosisController);
    app.use('/pharmacy',pharmacyController);
    app.use('/originalDiagnosis',originalDiagnosisController);
    app.use('/management',managementController);

    app.use('/waitingList', waitingController);
    app.use('/chart', chartController);
    app.use('/views', viewsController);
    app.use('/medicine', medicineController);
    app.use('/ocs', ocsController);
    app.use('/prescription', prescriptionController);

    console.log("## setup routes service ##");
}

module.exports = RoutesService;
