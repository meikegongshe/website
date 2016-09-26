var models = require('../models');

exports = module.exports = function (done) {
    models.shop.count(function (err, result) {
        if (err) return done(err);
        if (result > 0) return done();


    })

    function init() {
        var staff = new models.staff({
            name: 'test',
            type: 'test',
            price: 100,
            original: 1000,
            intro: 'This is a staff'
        }).save(function (err, done) {

        });
    }
};