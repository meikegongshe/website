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
router.get('/shop', home);
router.get('/shop/:id', shop);
router.get('/shop/service/:id', shop.service);
router.get('/shop/order/:id', shop.order);
router.post('/shop/order/:id', shop.order_post);
router.get('/shop/pay/:id', shop.order_success);

router.get('/commune', commune);

router.get('/mall', mall);

router.get('/account', account);
router.get('/account/members', account.member);
router.get('/account/member/:id', account.member);
router.get('/account/orders', account.order);
router.get('/account/order/:id', account.order);

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

exports = module.exports = router;