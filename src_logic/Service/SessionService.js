var session = require('express-session');
var redisStore = require('connect-redis')(session);
var moment = require('moment');
var config = require('../../Config');
var util = require('util');

var SessionService = function () {};

SessionService.Init = function(){
    var sessionSetting = {
        // cookie: {
        //   expires: new Date(moment().add('hours', 9).add('hours', 3)),
        //   maxAge: new Date(moment().add('hours', 9).add('hours', 3))
        // },
        /* 위 쿠키 설정과 아래 store 설정 간 충돌이 발생하는 듯 함 */
        store: new redisStore({
          port: config.redis.redisPort,
          host: config.redis.redisHost,
          password: config.redis.redisPassword,
          ttl: 21600, // redis를 2시간마다 검사하며 파기 시간이 지난 토큰 삭제
          logErrors: true
        }),
        secret: config.server.auth_key,
        resave: false,
        saveUninitialized: false
    };

    app.set('trust proxy', 1);
    app.use(session(sessionSetting));
}

/**
 * @description express-session cookie 및 session store 설정
 *
 * 기존 좀비 세션 문제 발생 원인 : 로그인 시 session 생성 후 auth controller에서 res.redirect를 수행하면 세션을 잃어버리는 이슈 발생
 * (생성 시req.session.variable에 직접 값 대입을 수행함)
 * 쿠키 설정(maxAge)과 미들웨어 내 메모리 변수(req.session 객체), 레디스 내 저장된 토큰 값 사이의 관계가 어그러지는 것으로 추정됨
 *
 * 1. cookie 내 maxAge, expires 값이 둘 다 설정되어 있을 경우 maxAge 설정이 우선순위가 되어 쿠키의 expires 값으로 잡힌다. / 즉 하나만 설정해도 무방한 것으로 추정
 * > 이게 브라우저에 생성되는 쿠키 값 수명의 설정인데 서버 세션 스토어(redis) 내 세션 데이터가 삭제되면 무의미(서버측 세션이 만료)
 *
 * 2. redis store 설정 내 ttl 설정은 세션 발행 시점으로부터 + ttl 설정 시간이 지나면 데이터를 삭제한다. (Ex. ttl 값이 60이면 세션 발행 후 60초 뒤에 데이터 삭제)
 * > redis 내 다른 데이터는 삭제하지 않는다. (테스트 결과 sess으로 묶인 key 값만 검사하여 삭제하는걸로 추정)
 * > default 값은 24h 이며 session.cookie.maxAge 값이 설정되어 있는 경우 해당 값으로 설정되고 직접 설정해줄 수도 있다.
 *
 * 3. 서버의 타임존을 kst로 변경해도 node middleware의 timezone은 utc로 설정되어 있음
 * > 미들웨어 시간을 kst로 바꿔주거나 한국에서 서비스할 경우 new Date() + 9 hours 으로 쿠키 세팅을 해주어야 함
 *
 * 결론 : express-session 설정중 cookie 설정을 빼버리면 store 설정에 의해서만 세션이 동작하므로 일단 정상적으로 동작함
 * > 더 멋지게 사용하고 싶으면 cookie 시간 - 레디스 내 토큰 값 - 미들웨어 간의 관계와 수명을 완벽하게 맞춰주면 되지 않을까 추정됨
 * > 현재 브라우저에 생성되는 쿠키는 무용지물 쿠키임, 쿠키 값에 의존적인 서비스를 구현할 때에는 다른 방식으로 구현하는 것이 좋을듯
 *
 */

module.exports = SessionService;
