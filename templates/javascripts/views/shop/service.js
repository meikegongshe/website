exports.init = function () {
    var order = $('[data-type="order"]');
    if (order) {
        order.click(function () {
            location.href = '/shop/order/' + order.attr('data-id');
        })
    }
};