exports.init = function () {
    var order_item = $('[data-type="order-unpaid"]');
    if (order_item) {
        order_item.click(function () {
            location.href = '/shop/pay/' + order_item.attr('data-id');
        })
    }

    var order_item = $('[data-type="order-unused"]');
    if (order_item) {
        order_item.click(function () {
            location.href = '/account/consume/' + order_item.attr('data-id');
        })
    }
}