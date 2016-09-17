var model = require('../../models');

exports = module.exports = function (req, res, next) {
    model.shop.findOne(function (err, data) {
        if (err || !data)return next(err);

        return res.render('index', getViewModel(data));
    });


    function getViewModel(shop) {
        return {
            title: '美客公社',
            name: shop.name,
            images: shop.images,
            staffs: shop.staffs,
            services: shop.services
        }
    }
}