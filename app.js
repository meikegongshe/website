var config = require('./config'),
    express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    RedisStore = require('connect-redis')(session),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    log4js = require('log4js'),
    lodash = require('lodash');

require('dotenv').config();

var loggerTypes = lodash.split(process.env.LOGGER_TYPES, ',');
var logTypeConfigs = [];

loggerTypes.forEach(function (type) {
    switch (type) {
        case 'console':
            logTypeConfigs += {type: 'console'};
            break;

        case 'file':
            logTypeConfigs += {
                type: 'file',
                filename: __dirname + '/logs/log.txt',
                category: 'general',
                maxLogSize: 2048,
                backups: 10
            };
            break;
    }
});

log4js.configure({appenders: logTypeConfigs});

// global variables
global.logger = log4js.getLogger();
global.lodash = lodash;

var routes = require('./routes');

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser(config.session_secret));
app.use(session({
    secret: config.session_secret,
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host
    }),
    resave: true,
    saveUninitialized: true
}));

if (app.get('env') == 'development') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'data/cms')));
    app.use(express.static(path.join(__dirname, 'src/public')));
}

app.use(passport.initialize());
app.use(passport.session());

// TODO: remove password
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
    if (!userId) {
        return done(null, null);
    }

    Account.get(userId, function (err, user) {
        if (err) {
            return done(err);
        }

        done(null, user);
    });
});

passport.use('local', new LocalStrategy(localStrategyMiddleware));

app.use(busboy({
    limits: {
        fileSize: config.file_size_limit,
        files: config.file_count_limit
    }
}));

app.use(require('./middlewares/website')());
app.use(require('./middlewares/activity_log'));

// TODO: app uses the apikey to access protected pages, should we also limit those requests?
app.use(require('./middlewares/auth').ensurePhonenumber);

// set after the auth middleware.
app.use(require('./middlewares/message').getUnreadCount);
app.use(require('./middlewares/link').getLinks);

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
    if (err.status != 404) {
        console.log(err.stack); // log the err.
    }

    return routes.errorHandler(err, {detail: app.get('env') == 'development'}, req, res, next);
});

module.exports = app;