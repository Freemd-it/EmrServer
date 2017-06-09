var csurf = require('csurf');
var util = require('util');

var config = require('../Common/Config.js');
var kakaoTalkMessageController = require('../Controller/KakaoTalkMessageController.js');
var iotKakaoTalkMessageController = require('../Controller/IotKakaoTalkMessageController.js');

var csrfProtection = new csurf({ cookie: true });

var RoutesService = function(){};

RoutesService.Init = function(){

    if (app.get('env') === 'production'){

        app.use(csrfProtection);
        console.log(util.format('Use Middleware csrf'));
    }

    app.use(function log(req, res, next){

        console.log(util.format("## URL : %s / IP : %s ##", req.originalUrl, req.ip));
        next();
    });

    app.use('/kakao', kakaoTalkMessageController);
    app.use('/iot', iotKakaoTalkMessageController);

    console.log("## setup routes ##");
}

module.exports = RoutesService;
