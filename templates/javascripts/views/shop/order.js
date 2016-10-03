exports.init = function () {
    var confirm_btn = $('[data-type="order_confirm"]');
    if(confirm_btn) {
        confirm_btn.click(function () {
            // TODO: should submit form
            location.href = '/shop/pay/100';
        })
    }
};

exports.add = function () {

};