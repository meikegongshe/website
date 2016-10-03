exports.init = function () {
    // init shop list
    var shop_list = $('[data-type="shop"]');
    if (shop_list) {
        shop_list.each(function (index, item) {
            $(item).click(function () {
                location.href = '/shop/' + $(item).attr('data-id');
            })
        });
    }
}