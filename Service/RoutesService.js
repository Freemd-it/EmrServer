var csurf = require('csurf');
var util = require('util');

var config = require('../Common/Config.js');
var userController = require('../Controller/UserController.js');
var authController = require('../Controller/AuthController.js');
var receiptController = require('../Controller/ReceiptController.js');

var csrfProtection = new csurf({ cookie: true });

var RoutesService = function(){};

RoutesService.Init = function(){

    if (app.get('env') === 'production'){

        app.use(csrfProtection);
        console.log(util.format('Use Middleware csrf'));
    }

    app.use(function log(req, res, next){

        res.header('Access-Control-Allow-Origin', config.serverConfig.accept_domain);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    app.use('/user', userController);
    app.use('/auth', authController);
    app.use('/receipt', receiptController);

    console.log("## setup routes ##");
}

module.exports = RoutesService;
