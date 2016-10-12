var asset = require('./asset'),
    home = require('./views/home'),
    shop = require('./views/shop/shop'),
    service = require('./views/shop/service'),
    order = require('./views/shop/order'),
    phone = require('./views/account/phone'),
    user_order = require('./views/account/order'),
    pay = require('./views/shop/pay'),
    user_pay = require('./views/account/pay'),
    account = require('./views/account/index');

$('document').ready(function () {
    console.log('page is ready');
    console.log(asset.data_types.join(','));

    account.init();
    home.init();
    shop.init();
    service.init();
    order.init();
    phone.init();
    user_order.init();
    pay.init();
    user_pay.init();
});