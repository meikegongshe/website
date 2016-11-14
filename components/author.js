'use strict';

var passport = require('passport'),
    wechatStrategy = require('passport-wechat').Strategy;

passport.use(new wechatStrategy({
    appID: 'wx8c0b9d8b32234d7a',
    appSecret: 'cd9012a9fd503dc46ca28fae50a5e608',
    client: 'wechat',
    scope: 'snsapi_userinfo',
    state: 'meike',
    callbackURL: 'http://www.meikes.cn/auth/wechat/callback'
}, function (accessToken, refreshToken, profile, expires_in, done) {
    var models = require('../models');

    logger.debug("access token:" + accessToken);
    logger.debug("refresh token:" + refreshToken);
    logger.debug("profile:" + JSON.stringify(profile));

    if (!profile || !profile.openid) return done('Auth failed', null);

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
                        account.accessToken = accessToken;
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
                    account.accessToken = accessToken;
                    return done(null, account);
                })
            }
        })
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

exports = module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
}