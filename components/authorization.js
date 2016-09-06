'use strict';

var passport = require('passport'),
    wechatStrategy = require('passport-wechat').Strategy;

var supportedAuthTypes = ['default', 'wechat', 'qq', 'weibo'];

var wechat = new wechatStrategy({
    appID: 'appID',
    appSecret: 'appSecret'
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
});

exports = module.exports = function (req, res, next) {
    var type = 'default';

    if (req.auth && req.auth.type && supportedAuthTypes.indexOf(req.auth.type) >= 0) {
        type = req.auth.type;
    }

    switch (type) {
        case 'wechat':
            return passport.authorize('wechat');

        default:
            return next();
    }
};

exports.initialize = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
}