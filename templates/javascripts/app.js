var asset = require('./asset'),
    home = require('./views/home'),
    shop = require('./views/shop/shop'),
    service = require('./views/shop/service'),
    order = require('./views/shop/order');

$('document').ready(function () {
    console.log('page is ready');
    console.log(asset.data_types.join(','));

    var member_btn = $('#members-btn');
    if (member_btn) {
        member_btn.click(function () {
            location.href = '/account/members';
        })
    }

    var unpaid = $('#unpaid-btn');
    if (unpaid) {
        unpaid.click(function () {
            location.href = '/account/orders#2';
        })
    }

    var unpaid = $('#unused-btn');
    if (unpaid) {
        unpaid.click(function () {
            location.href = '/account/orders#3';
        })
    }

    var unpaid = $('#refund-btn');
    if (unpaid) {
        unpaid.click(function () {
            location.href = '/account/orders#4';
        })
    }

    home.init();
    shop.init();
    service.init();
    order.init();
});