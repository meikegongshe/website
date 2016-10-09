exports.init = function () {
    document.getElementById('debug-log').innerText += 'result:';

    var pay_wechat = $('[data-type="pay-wechat"]');

    document.getElementById('debug-log').innerText += pay_wechat.html();

    if (pay_wechat) {
        pay_wechat.click(function () {
            location.href = '/account/pay/' + pay_wechat.attr('data-id');
        })
    }
};