var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

// 常用中间件
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// 处理404错误
keystone.set('404', function (req, res, next) {
    res.notfound();
});

// 处理其它错误
keystone.set('500', function (err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});

// 加载路由
var routes = {
    views: importRoutes('./views')
};

// 绑定路由
exports = module.exports = function (app) {

    app.get('/', routes.views.index);
    app.all('/signin', routes.views.signin);
    app.get('/signout', routes.views.signout);
    app.get('/account', routes.views.account);

}