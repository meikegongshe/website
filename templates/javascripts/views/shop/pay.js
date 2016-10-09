exports.init = function () {
    var pay_wechat = $('[data-type="pay-wechat"]');
    if (pay_wechat) {
        pay_wechat.click(function () {
            location.href = '/account/pay/' + pay_wechat.attr('data-id');
        })
    }
};