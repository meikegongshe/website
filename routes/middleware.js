exports.error = function (req, res, next) {
    next();
};

exports.auth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.send('Please logon first');
    }
};

exports.auth_manager = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role.indexOf('manager') >= 0) {
            return next();
        } else {
            return res.send('No permission');
        }
    } else {
        return res.send('Please logon first');
    }
};