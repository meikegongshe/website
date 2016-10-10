var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    middleware = require('./middleware');
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

router.get('/auth/wechat', passport.authenticate('wechat'));
router.get('/auth/wechat/callback', passport.authenticate('wechat', {
    failureRedirect: '/auth/fail',
    successReturnToOrRedirect: '/'
}));

router.get('/', home);
router.get('/shop', home);
router.get('/shop/:id', shop);
router.get('/shop/service/:id', shop.service);
router.get('/shop/order/:id', middleware.auth, shop.order);
router.post('/shop/order/:id', middleware.auth, shop.order_post);
router.get('/shop/pay/:id', middleware.auth, shop.order_success);

router.get('/commune', commune);

router.get('/mall', mall);

router.get('/account', middleware.auth, account);
router.get('/account/members', middleware.auth, account.member);
router.get('/account/member/:id', middleware.auth, account.member);
router.get('/account/orders', middleware.auth, account.order);
router.get('/account/order/:id', middleware.auth, account.order);
router.get('/account/phone', middleware.auth, account.phone);
router.post('/account/phone', middleware.auth, account.phone_post);
router.get('/account/pay/success/:id', middleware.auth, account.pay_success);
router.get('/account/pay/fail/:id', middleware.auth, account.pay_fail);
router.get('/account/pay/:id', middleware.auth, account.pay);
router.get('/account/consume/:id', middleware.auth, account.consume);

//router.use('/manage', manage);

router.get('/manage', manage);
router.get('/manage/shop', manage.shop);
router.post('/manage/shop', manage.shop_create);
router.get('/manage/shop/:id', manage.shop);
router.post('/manage/shop/:id', manage.shop_update);
router.get('/manage/shop/:id/staffs', manage.staffs);
router.get('/manage/shop/:id/staff', manage.staff);
router.post('/manage/shop/:id/staff', manage.staff_create);
router.get('/manage/staff/:tid', manage.staff);
router.post('/manage/staff/:tid', manage.staff_update);
router.get('/manage/shop/:id/services', manage.services);
router.get('/manage/shop/:id/service', manage.service);
router.post('/manage/shop/:id/service', manage.service_create);
router.get('/manage/service/:eid', manage.service);
router.post('/manage/service/:eid', manage.service_update);
router.get('/manage/consume', manage.consume);
router.post('/manage/consume', manage.consume_post);
router.get('/manage/consumes/:id', manage.consumes);

// wechat verification
router.get('/wechat/verify', function (req, res, next) {
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;

    logger.debug('signature:' + signature + ', timestamp:' + timestamp + ', nonce:' + nonce + ', echostr:' + echostr);

    return res.send(echostr);
});

exports = module.exports = router;