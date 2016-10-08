var wechat_pay = require('weixin-pay');

var wechat_pay = wechat_pay({
    appid: 'xxxxxxxx',
    mch_id: '1234567890',
    partner_key: 'xxxxxxxxxxxxxxxxx', //微信商户平台API密钥
    pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书
});

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

exports.createOrder = function (req, service, fee, callback) {
    wechat_pay.getBrandWCPayRequestParams({
        openid: req.user.openid,
        body: service.name,
        detail: service.name,
        out_trade_no: '20161010' + Math.random().toString().substr(2, 10),
        total_fee: service.price,
        spbill_create_ip: getClientIp(req),
        notify_url: 'http://www.v-wisdom.com'
    }, callback);
};