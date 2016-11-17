var https = require('https');

var menu = {
    "button": [
        {
            "type": "view",
            "name": "立刻变美",
            "url": "http://www.dianping.com/shop/69499788"
        },
        {
            "type": "click",
            "name": "会员中心",
            "key": "member_center"
        },
        {
            "type": "view",
            "name": "颜值女神",
            "url": "http://wx8c0b9d8b32234d7a.newvote.idouzi.com/index.php?r=mobile/newVote/index&wxid=73814&event_id=580f2dd2a3774b782451967f&from=groupmessage&isappinstalled=0&state=946d9577cc2e8c967eed3e084d1de8af&shareOpenid=o8ZHDjsPfcgBgcZ4g4iPtNtSudVg&sharestatus=1"
        }]
};

exports.menu_create = function (req, res, next) {
    httpsRequest('/cgi-bin/menu/create?access_token=' + encodeURIComponent(req.user.accessToken), 'post', menu, function (err) {
        if (err) return next(err);

        return res.send('Done');
    })
};

function httpsRequest(path, method, data, callback) {
    if (typeof(data) == 'function') {
        data = null;
        callback = data;
    }

    var content = (data == null ? '' : JSON.stringify(data));

    logger.debug('send https request, data: ' + content);

    if (method.toLowerCase() == 'get' && data != null) {
        var param = (path.indexOf('?') < 0 ? '?' : '&');
        param += require('querystring').stringify(data);

        path += param;
    }

    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: path,
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'Application/json; charset=UTF-8',
            'Content-Length': content.length
        }
    };

    logger.debug(options);

    var request = https.request(options, function (result) {
        logger.debug('STATUS: ' + result.statusCode);
        logger.debug('HEADERS: ' + JSON.stringify(result.headers));
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            logger.debug('BODY: ' + chunk);

            callback(null, chunk.length == 0 ? null : JSON.parse(chunk));
        });
    });

    request.on('error', function (e) {
        logger.debug('problem with request: ' + e.message);

        callback(new Error(e.message));
    });

    if (method.toLowerCase() == 'post' && data != null) {
        // write data to request body
        request.write(content);
    }

    request.end();
}