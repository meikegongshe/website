var express = require('express'),
    router = express.Router(),
    manage = require('./views/manage'),
    shop = require('./views/shop'),
    commune = require('./views/commune'),
    mall = require('./views/mall'),
    account = require('./views/account');

router.use(function (req, res, next) {
    logger.debug(req.method + ': ' + req.path);

    next();
});

router.get('/', shop);
router.get('/shop', shop);
router.get('/service/:id', shop.service);

router.get('/commune', commune);

router.get('/mall', mall);

router.get('/account', account);

router.use('/manage', manage);

exports = module.exports = router;