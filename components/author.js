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
}, function (accessToken, refreshToken, profile, done) {
    logger.debug("access token:" + accessToken);
    logger.debug("refresh token:" + refreshToken);
    logger.debug("profile:" + JSON.stringify(profile));

    return done(null, profile);
}));

passport.serializeUser(function (user, done) {
    logger.debug("serialize user:" + JSON.stringify(user));

    done(null, user.openid);
});

passport.deserializeUser(function (user, done) {
    logger.debug("deserialize user" + JSON.stringify(user));

    done(null, user);
});

exports = module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
}