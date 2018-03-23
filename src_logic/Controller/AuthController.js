var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');

var common = require('../Common/Common.js');
var passportService = require('../Service/PassportService.js');

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


router.get('/google/callback', passportService.passport.authenticate('google'), function(req, res){
    console.log(req.session)
    if (req.user._json.domain !== 'freemed.or.kr') {
        // req.logOut();
        req.session.destroy();
        return res.redirect('http://localhost:3000/login?err=account');
    }
    req.session.destroy();
    // req.logOut();
    res.redirect('http://localhost:3000/receipt');
});

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
