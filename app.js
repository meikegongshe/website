var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    RedisStore = require('connect-redis')(session),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    log4js = require('log4js'),
    lodash = require('lodash'),
    author = require('./components/authorization'),
    server = require('./components/server');

require('dotenv').config();

var loggerTypes = lodash.split(process.env.LOGGER_TYPES, ',');
var logTypeConfigs = [];

loggerTypes.forEach(function (type) {
    switch (type) {
        case 'console':
            logTypeConfigs.push({type: 'console'});
            break;

        case 'file':
            logTypeConfigs.push({
                type: 'file',
                filename: __dirname + '/logs/log.txt',
                maxLogSize: 204800,
                backups: 10
            });
            break;
    }
});

log4js.configure({appenders: logTypeConfigs});

// global variables
global.logger = log4js.getLogger();
global.lodash = lodash;

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './templates/views');

app.use(favicon(__dirname + '/public/favicon.ico'));

// The body-parser does not think the utf8 is a valid encoding...
app.use(function (req, res, next) {
    if (req.headers['content-type']) {
        req.headers['content-type'] = req.headers['content-type'].replace('charset=utf8', 'charset=utf-8');
    }

    return next();
});

// the default size is 100kb.
// TODO: return less data from the application management api.
app.use(bodyParser.json({
    'limit': '1mb'
}));

var sessionSecret = 'E8FE115F3FE05D54331B2A9EC5B3EB79';

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(sessionSecret));
app.use(session({
    secret: sessionSecret,
    store: new RedisStore({
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
author.initialize(app);

var routes = require('./routes');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    // development error handler
    // will print stacktrace
    // production error handler
    // no stacktraces leaked to user
    logger.debug(err);

    if (err.status != 404) {
        logger.debug(err.stack); // log the err.
    }

    return res.send(err.message);
});

server(app);