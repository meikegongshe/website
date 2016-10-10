exports.init = function () {
    function onBridgeReady() {
        var order_id = $('#order-id').attr('data-id');

        if (payArgs) {
            WeixinJSBridge.invoke("getBrandWCPayRequest", payArgs, function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // success
                    location.href = '/account/pay/success/' + order_id;
                } else {
                    location.href = '/account/pay/fail/' + order_id;
                }
            });
        }
    }

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}