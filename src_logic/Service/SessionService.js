var session = require('express-session');
var redisStore = require('connect-redis')(session);
var moment = require('moment');
var config = require('../../Config');
var util = require('util');

var SessionService = function () {};

SessionService.Init = function(){

    var sessionSetting = {
        secret: config.server.session_secret,
        cookie: {
          expires: new Date(moment().add('hours', 9).add('hours', config.server.session_expire)),
          maxAge: new Date(moment().add('hours', 9).add('hours', config.server.session_expire))
        },
        store: new redisStore({
          port: config.redis.redisPort,
          host: config.redis.redisHost,
          password: config.redis.redisPassword,
          ttl: 7200 // redis를 2시간마다 검사하며 파기 시간이 지난 토큰 삭제
        }),
        secret: config.server.auth_key,
        resave: false,
        saveUninitialized: false
    };

    app.set('trust proxy', 1);
    app.use(session(sessionSetting));
}

module.exports = SessionService;
