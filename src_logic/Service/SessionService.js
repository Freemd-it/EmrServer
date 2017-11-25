var session = require('express-session');
var redisStore = require('connect-redis')(session);
var config = require('../../Config');
var util = require('util');

var SessionService = function () {};

SessionService.Init = function(){

    var sessionSetting = {
        cookie: { expires: new Date(Date.now() + config.serverConfig.session_expire), maxAge: config.serverConfig.session_expire },
        store: new redisStore({
          port: config.redisConfig.redisPort,
          host: config.redisConfig.redisHost
        }),
        secret: config.serverConfig.session_secret,
        resave: false,
        saveUninitialized: true
    };

    app.set('trust proxy', 1);
    sessionSetting.cookie.secure = true;

    app.use(session(sessionSetting));
}

SessionService.Check = function(token){

    var token = token;
}

module.exports = SessionService;
