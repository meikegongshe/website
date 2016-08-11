var _ = require('underscore'),
    keystone = require('keystone');

/**
 初始化标准的视图locals。
 包含应该在路由控制器执行之前初始化的所有东西。
 */
exports.initLocals = function (req, res, next) {
    var locals = res.locals;
    locals.user = req.user;

    // 在这里添加你自己的local变量

    next();
};

/**
 初始化错误处理函数到`res`中
 */
exports.initErrorHandlers = function (req, res, next) {

    res.err = function (err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    }

    res.notfound = function (title, message) {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message
        });
    }

    next();
};

/**
 在视图渲染之前获取并清理flashMessages
 */
exports.flashMessages = function (req, res, next) {

    var flashMessages = {
        info: req.flash('info'),
        success: req.flash('success'),
        warning: req.flash('warning'),
        error: req.flash('error')
    };

    res.locals.messages = _.any(flashMessages, function (msgs) {
        return msgs.length
    }) ? flashMessages : false;

    next();
};