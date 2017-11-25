 

var express = require('express');  
var router = express.Router();

router.use(function log(req, res, next) {

    console.log('## [TEST] UserController started ##');
    next();
});

router.get('/receipt',(req,res,next)=>{
    res.render('receipt');
})

router.get('/ocs',(req,res,next)=>{
    res.render('ocs');
})

router.get('/prediagnosis',(req,res,next)=>{
    res.render('prediagnosis');
})

router.get('/pharmacy',(req,res,next)=>{
    res.render('pharmacy');
})

router.get('/main',(req,res,next)=>{
    res.render('main');
})
router.get('/management',(req,res,next)=>{
    res.render('management');
})
 
module.exports = router;
