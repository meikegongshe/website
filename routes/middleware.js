exports.error = function (req, res, next) {
    next();
};

exports.auth = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        return res.send('Please logon first');
    }
}