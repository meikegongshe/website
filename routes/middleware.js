exports.error = function (req, res, next) {
    next();
};

exports.auth = function (req, res, next) {
    if (req.hostname == 'localhost') {
        getLocalUser(function (err, user) {
            if (err) return next(err);

            req.user = user
            return next();
        })
    } else if (req.isAuthenticated()) {
        return next();
    } else {
        return res.send('Please logon first');
    }
};

exports.auth_manager = function (req, res, next) {
    if (req.hostname == 'localhost') {
        getLocalUser(function (err, user) {
            if (err) return next(err);

            req.user = user
            return next();
        })
    } else if (req.isAuthenticated()) {
        if (req.user.role.indexOf('manager') >= 0) {
            return next();
        } else {
            return res.send('No permission');
        }
    } else {
        return res.send('Please logon first');
    }
};

function getLocalUser(callback) {
    return require('../models').account.findOne({phone: '12345678901'}, function (err, user) {
        if (err) return callback(err);

        user.openid = 'openid';
        return callback(null, user);
    });
}