var wechat_pay = require('weixin-pay');

var wechat_pay = wechat_pay({
    appid: 'wx8c0b9d8b32234d7a',
    mch_id: '1296148301',
    partner_key: '0C041A15FD88DFBE55844778EFD86918',
    pfx: require('fs').readFileSync(__dirname + '/../asset/cert/apiclient_cert.p12'),
});

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

exports.createOrder = function (req, order, callback) {
    wechat_pay.getBrandWCPayRequestParams({
        openid: req.user.openid,
        body: order.service.name,
        detail: order.service.name,
        out_trade_no: '20161010' + Math.random().toString().substr(2, 10),
        total_fee: order.price * 100,
        spbill_create_ip: getClientIp(req),
        notify_url: 'http://www.v-wisdom.com'
    }, callback);
};