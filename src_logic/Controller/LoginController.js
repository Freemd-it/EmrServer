const express = require('express');

const router = express.Router();


router.get('/', function (req, res, next) {
    res.render('login_test');
})


module.exports = router;
