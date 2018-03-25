var session = require('express-session');
var redisStore = require('connect-redis')(session);
var moment = require('moment');
var config = require('../../Config');
var util = require('util');

var SessionService = function () {};

SessionService.Init = function(){

    var sessionSetting = {
        cookie: { expires: new Date(Date.now() + config.server.session_expire), maxAge: new Date(Date.now() + config.server.session_expire)},
        store: new redisStore({
          port: config.redis.redisPort,
          host: config.redis.redisHost,
          password: config.redis.redisPassword
        }),
        secret: config.server.auth_key,
        resave: false,
        saveUninitialized: false
    };

    app.set('trust proxy', 1);
    // sessionSetting.cookie.secure = true;
    app.use(session(sessionSetting));
}

SessionService.Check = function(token){

    var token = token;
}

module.exports = SessionService;
