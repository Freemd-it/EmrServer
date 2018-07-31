const express = require('express');

const router = express.Router();


router.get('/', function (req, res, next) {
    if (req.session.passport) return res.redirect('/receipt')
    res.render('login');
})


module.exports = router;
