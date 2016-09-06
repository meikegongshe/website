exports = module.exports = function (app, options) {
    if (app == null) {
        console.error('app is null');
        process.exit(1);

        return;
    }

    var options = options || {};
    var debug = require('debug')('website:server');
    var http = require('http');

    var env = process.env.NODE_ENV || 'development';
    var port = process.env.PORT || 3000;

    var server = http.createServer(app);

    if (app.get('env') === 'production') {
        server.listen(port, process.env.IP);
    }
    else {
        server.listen(port);
    }

    server.on('error', options.onError || onError);
    server.on('listening', options.onListening || onListening);

    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}