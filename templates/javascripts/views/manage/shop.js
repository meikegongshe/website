exports.init = function () {
    var shop_create = $('[data-type="shop-confirm"]');
    var shop_form = $('[data-type="shop-form"]');
    if (shop_create && shop_form) {
        shop_create.click(function () {
            shop_form.submit();
        })
    }
}