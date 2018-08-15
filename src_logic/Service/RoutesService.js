var csurf = require('csurf');
var util = require('util');
var moment = require('moment');

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


    app.use((req, res, next) => {

        const pattern1 = /^\/login*/
        const pattern2 = /^\/auth*/
        const authResult = pattern1.test(req.originalUrl) || pattern2.test(req.originalUrl)

        console.log('session', req.session.passport)
        console.log('authResult', authResult)
        if (!req.session.passport && !authResult){
          res.redirect('/login')
        } else {
          res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        }
        next();
    });

    /* 테스트 화면 출력용 */
    app.get('/', (req, res) => { res.redirect('/login') })
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
    // app.use('/views', viewsController);
    app.use('/medicine', medicineController);
    app.use('/ocs', ocsController);
    app.use('/prescription', prescriptionController);

    console.log("## setup routes service ##");
}

module.exports = RoutesService;
