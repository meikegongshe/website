var express = require('express'),
    router = express.Router(),
    manage = require('./views/manage');

router.use(function (req, res, next) {
    logger.debug(req.method + ': ' + req.path);

    next();
});

router.get('/', function (req, res) {
    return res.render('index', {
        title: '美客公社'
    });
});

router.use('/manage', manage);

exports = module.exports = router;