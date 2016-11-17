'use strict';

var passport = require('passport'),
    wechatStrategy = require('passport-wechat').Strategy,
    models = require('../models'),
    https = require('https');

var appId = 'wx8c0b9d8b32234d7a',
    appSecret = 'cd9012a9fd503dc46ca28fae50a5e608';

passport.use(new wechatStrategy({
    appID: appId,
    appSecret: appSecret,
    client: 'wechat',
    scope: 'snsapi_userinfo',
    state: 'meike',
    callbackURL: 'http://www.meikes.cn/auth/wechat/callback',
    getToken: function (openid, callback) {
        logger.debug('get access token, openid: ' + openid);
        models.wechatToken.getToken(openid, callback);
    },
    saveToken: function (openid, token, callback) {
        logger.debug('set access token, openid: ' + openid + ' token: ' + JSON.stringify(token));
        models.wechatToken.setToken(openid, token, callback);
    }
}, function (accessToken, refreshToken, profile, expires_in, done) {
    logger.debug("access token:" + accessToken);
    logger.debug("refresh token:" + refreshToken);
    logger.debug("profile:" + JSON.stringify(profile));

    if (!profile || !profile.openid) return done('Auth failed', null);

    // get web access token
    getAccessToken(function (tokenData) {
        // find account
        models.thirdAccount.findOne({uid: profile.openid})
            .populate('account')
            .exec(function (err, thirdAccount) {
                if (err) return done(err, null);

                if (!thirdAccount) {
                    // create account
                    models.account.create({
                        name: profile.nickname,
                        portrait: profile.headimgurl
                    }, function (err, account) {
                        if (err) return done(err, null);

                        models.thirdAccount.create({
                            type: 'wechat',
                            uid: profile.openid,
                            account: account
                        }, function (err) {
                            if (err) return done(err, null);

                            account.openid = profile.openid;
                            account.accessToken = tokenData.access_token;
                            return done(null, account);
                        })
                    })
                } else {
                    // update name and portrait
                    thirdAccount.account.name = profile.nickname;
                    thirdAccount.account.portrait = profile.headimgurl;
                    thirdAccount.account.save(function (err, account) {
                        if (err) return done(err, null);

                        account.openid = profile.openid;
                        account.accessToken = tokenData.access_token;
                        return done(null, account);
                    })
                }
            })
    });
}));

passport.serializeUser(function (user, done) {
    done(null, [user._id.toString(), user.openid, user.accessToken].join(','));
});

passport.deserializeUser(function (id, done) {
    var ids = id.split(',');
    require('../models').account.findOne({_id: ids[0]}, function (err, account) {
        if (err) return done(err, null);

        account.openid = ids[1];
        account.accessToken = ids[2];
        done(null, account);
    })
});

function getAccessToken(callback) {
    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?' + require('querystring').stringify({
            grant_type: 'client_credential',
            appid: appId,
            secret: appSecret
        }),
        method: 'GET'
    };

    logger.debug(options);

    https.request(options, function (result) {
        logger.debug('STATUS: ' + result.statusCode);
        logger.debug('HEADERS: ' + JSON.stringify(result.headers));
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            logger.debug('BODY: ' + chunk);

            return callback(JSON.parse(chunk))
        });
    }).end();
}

exports = module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
};