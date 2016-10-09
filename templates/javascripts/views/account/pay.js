exports.init = function () {
    function onBridgeReady() {
        if (payArgs) {
            WeixinJSBridge.invoke("getBrandWCPayRequest", payArgs, function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // success
                    location.href = '/account';
                } else {
                    document.getElementById('debug-log').innerText += res.err_msg;
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