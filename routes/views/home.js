var shop = require('./shop')._shop;

exports = module.exports = exports.index = function (req, res) {
    return res.render('index', {
        title: '美客公社',
        shops: [shop, shop, shop]
    });
};