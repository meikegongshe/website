var models = require('../../models');

exports = module.exports = exports.index = function (req, res) {
    models.shop.find(function (err, shops) {
        if(err) return next(err);

        return res.render('index', {
            title: '美客公社',
            shops: shops
        });
    });
};