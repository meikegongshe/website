var index = require('./views/manage/index'),
    shop = require('./views/manage/shop'),
    staffs = require('./views/manage/staffs'),
    staff = require('./views/manage/staff'),
    services = require('./views/manage/services'),
    service = require('./views/manage/service');

$('document').ready(function () {
    console.log('manage page is ready');

    index.init();
    shop.init();
    staffs.init();
    staff.init();
    services.init();
    service.init();
});