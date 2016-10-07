exports.init = function () {
    var shop_create = $('[data-type="shop-create"]');
    if (shop_create) {
        shop_create.click(function () {
            location.href = '/manage/shop';
        })
    }

    var shop_info = $('[data-type="shop-info"]');
    if (shop_info) {
        if (!Array.isArray(shop_info)) shop_info = [shop_info];

        shop_info.each(function (index, item) {
            $(item).click(function () {
                location.href = '/manage/shop/' + $(item).attr('data-id');
            })
        });
    }

    var shop_staff = $('[data-type="shop-staff"]');
    if (shop_staff) {
        if (!Array.isArray(shop_staff)) shop_staff = [shop_staff];

        shop_staff.each(function (index, item) {
            $(item).click(function () {
                location.href = '/manage/shop/' + $(item).attr('data-id') + '/staffs';
            })
        });
    }

    var shop_service = $('[data-type="shop-service"]');
    if (shop_service) {
        if (!Array.isArray(shop_service)) shop_service = [shop_service];

        shop_service.each(function (index, item) {
            $(item).click(function () {
                location.href = '/manage/shop/' + $(item).attr('data-id') + '/services';
            })
        });
    }
}