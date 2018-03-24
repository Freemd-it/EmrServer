var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var config = require('../../Config');
var common = require('../Common/Common.js');
var passportService = require('../Service/PassportService');
var sessionService = require('../Service/SessionService');

var router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [AUTH] AuthController started ##');
    next();
});

/* 로그인 부분 ajax로 처리하면 에러남, 무조건 form action으로 처리할 것 */
router.get('/login', passportService.passport.authenticate('google', { scope:
    // ['https://www.googleapis.com/auth/plus.login',
    // 'profile',
    // 'email',
    // 'https://www.googleapis.com/auth/plus.profile.emails.read',
    // 'https://www.googleapis.com/auth/user.birthday.read',
    // 'https://www.googleapis.com/auth/profile.language.read',
    // 'https://www.googleapis.com/auth/user.phonenumbers.read']
    ['profile', 'email']
}));

router.get('/google/callback',
  passportService.passport.authenticate('google',
  { failureFlash: false, failureRedirect: '/login?error=invalid_domain_' }),
  function(req, res){
    if (req.user._json.domain !== 'freemed.or.kr') {
        return res.redirect('/login?error=invalid_domain_');
    }
    // req.session.auth = 'normal'
    // req.session.auth = '3partLeader'
    // req.session.auth = 'doctor'
    // req.session.auth = 'pharmacist'
    req.session.auth = 'super'
    res.redirect('/receipt');
});

router.get('/logout', (req, res) => {

    req.session.destroy();
    res.redirect('/login');
})

// router.get('/login', function(req, res){
//
//     // console.log(req.body);
//     //var text = common.Encryption(req.query.password, 'aes-256-ctr');
//     // console.log("-------암호화-------");
//     // console.log(text);
//     // console.log("-------복호화-------");
//     // console.log(common.Decryption(text, 'aes-256-ctr'));
//     // console.log("-------해싱-------");
//     // console.log(common.Hashing(req.body.password, 'ripemd160WithRSA'));
//
//     res.status(200).json("Test");
// });


module.exports = router;
