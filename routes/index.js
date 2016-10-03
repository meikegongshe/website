var express = require('express'),
    router = express.Router(),
    manage = require('./views/manage'),
    home = require('./views/home'),
    shop = require('./views/shop'),
    commune = require('./views/commune'),
    mall = require('./views/mall'),
    account = require('./views/account');

router.use(function (req, res, next) {
    logger.debug(req.method + ': ' + req.path);

    next();
});

router.get('/', home);
router.get('/shop', shop);
router.get('/shop/:id', shop);
router.get('/shop/service/:id', shop.service);
router.get('/shop/order/:id', shop.order);
router.post('/shop/order/:id', shop.order_post);
router.get('/shop/pay/:id', shop.pay);

router.get('/commune', commune);

router.get('/mall', mall);

router.get('/account', account);
router.get('/account/members', account.member);
router.get('/account/member/:id', account.member);
router.get('/account/orders', account.order);
router.get('/account/order/:id', account.order);

router.use('/manage', manage);

exports = module.exports = router;