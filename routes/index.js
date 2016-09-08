var express = require('express'),
    router = express.Router(),
    middleware = require('./middleware');

router.get('/', function (req, res, next) {
   return res.render('index'); 
});

exports = module.exports = router;