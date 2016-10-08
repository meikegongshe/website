'use strict';

var passport = require('passport'),
    wechatStrategy = require('passport-wechat').Strategy;

passport.use(new wechatStrategy({
    appID: 'wx8c0b9d8b32234d7a',
    appSecret: 'cd9012a9fd503dc46ca28fae50a5e608',
    client: 'wechat',
    scope: 'snsapi_userinfo',
    state: 'meike',
    callbackURL: 'http://www.v-wisdom.com/auth/wechat/callback'
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

                        return done(null, account);
                    })
                })
            } else {
                // update name and portrait
                thirdAccount.account.name = profile.nickname;
                thirdAccount.account.portrait = profile.headimgurl;
                thirdAccount.account.save(function (err, account) {
                    if (err) return done(err, null);

                    return done(null, account);
                })
            }
        })
}));

passport.serializeUser(function (account, done) {
    done(null, account._id.toString());
});

passport.deserializeUser(function (id, done) {
    require('../models').account.findOne({_id: id}, function (err, account) {
        if (err) return done(err, null);

        done(null, account);
    })
});

exports = module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
}