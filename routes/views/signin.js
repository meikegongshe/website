var keystone = require('keystone');

exports = module.exports = function (req, res) {
    return res.redirect('/keystone/signin');
}