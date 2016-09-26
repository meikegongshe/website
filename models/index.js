var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, function (err) {
    if (err) {
        logger.error('failed to connect to %s, error is ', process.env.MONGO_URI, err.message);
        process.exit(1);
    }
});

mongoose.Promise = require('q').Promise;

require('./shop');
require('./service');
require('./staff');
require('./user');
require('./order');

exports.shop = mongoose.model('shop');
exports.service = mongoose.model('service');
exports.staff = mongoose.model('staff');
exports.user = mongoose.model('user');
exports.order = mongoose.model('order');