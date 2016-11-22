var https = require('https'),
    xmlParser = require('xml2json');

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

exports.handler = function (data, res, next) {
    var action = JSON.parse(xmlParser.toJson(data)).xml;
    logger.debug('received data: ' + JSON.stringify(action));

    var xmlContent = '';

    if (action.MsgType == 'text' && action.Content == '来一发') {
        xmlContent = textMessage(action, 'http://www.meikes.cn/auth/wechat/');
    } else if (action.MsgType == 'event' && action.EventKey == 'member_center') {
        xmlContent = textMessage(action, '美丽的顾客：\r\n欢迎关注美客公社 / MakerCommune，我们不推销、不办卡、不玩套路，只想真诚地为您创造美丽和服务，因为我们相信您的口碑分享必将创造价值。在线预约及拓客返利功能正在调试中，故暂且使用点评下单预约，敬请期待！\r\n美丽预约：15899878877 15889552280\r\n美业商家加盟请联系微信：edo-design');
    }

    logger.debug('return data: ' + xmlContent);
    res.set({'Content-Type': 'text/xml'});
    return res.send(xmlContent);
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

function textMessage(messageObj, content) {
    return '<xml>'
        + '<ToUserName><![CDATA[' + messageObj.FromUserName + ']]></ToUserName>'
        + '<FromUserName><![CDATA[' + messageObj.ToUserName + ']]></FromUserName>'
        + '<CreateTime>' + Date.now() + '</CreateTime>'
        + '<MsgType><![CDATA[text]]></MsgType>'
        + '<Content><![CDATA[' + content + ']]></Content>'
        + '</xml>';
}