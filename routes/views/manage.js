var models = require('../../models');

exports = module.exports = function (req, res, next) {
    // TODO: add user check
    models.shop.find({}, function (err, shops) {
        if (err) return next(err);

        return res.render('manage/index', {
            title: '美客公社后台管理',
            shops: shops
        });
    })
};

exports.shop = function (req, res, next) {
    if (req.params.id) {
        models.shop.findOne({_id: req.params.id}, function (err, shop) {
            if (err) return next(err);

            return res.render('manage/shop', {
                title: shop.name,
                shop: shop
            })
        })
    } else {
        res.render('manage/shop', {
            title: '新建商铺'
        })
    }
};

function createShop(req) {
    logger.debug(req.body);

    // TODO: add verification
    var shop = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        location_x: parseFloat(req.body.location_x),
        location_y: parseFloat(req.body.location_y)
    };
    images = [req.body.image1, req.body.image2, req.body.image3, req.body.image4, req.body.image5];
    lodash.remove(images, function (item) {
        return !item;
    });
    shop.images = images;

    return shop;
}

exports.shop_create = function (req, res, next) {
    models.shop.create(createShop(req), function (err) {
        if (err) return next(err);

        return res.redirect('/manage');
    })
};

exports.shop_update = function (req, res) {
    models.shop.update({_id: req.body._id}, createShop(req), function (err) {
        if (err) return next(err);

        return res.redirect('/manage');
    })
};

exports.shop_delete = function (req, res) {
    // TODO: delete a shop
};

exports.staffs = function (req, res, next) {
    if (req.params.id) {
        models.shop.findOne({_id: req.params.id})
            .populate('staffs')
            .exec(function (err, shop) {
                if (err) return next(err);

                return res.render('manage/staffs', {
                    title: shop.name,
                    shop: shop
                })
            })
    } else {
        return res.redirect('/manage');
    }
};

exports.staff = function (req, res, next) {
    if (req.params.tid) {
        models.staff.findOne({_id: req.params.tid}, function (err, staff) {
            if (err) return next(err);

            return res.render('manage/staff', {
                title: staff.name,
                staff: staff
            })
        })
    } else {
        res.render('manage/staff', {
            title: '新建员工'
        })
    }
};

function createStaff(req) {
    logger.debug(req.body);

    // TODO: add verification
    var staff = {
        name: req.body.name,
        title: req.body.title,
        portrait: req.body.portrait,
        shop: req.params.id
    };

    return staff;
};

exports.staff_create = function (req, res, next) {
    models.staff.create(createStaff(req), function (err, result) {
        if (err) return next(err);

        logger.debug(result.toObject());
        models.shop.findOneAndUpdate({_id: req.params.id}, {$addToSet: {staffs: result}}, function (err) {
            if (err) return next(err);

            return res.redirect('/manage/shop/' + req.params.id + '/staffs');
        })
    })
};

exports.staff_update = function (req, res, next) {
    models.staff.update({_id: req.body._id}, createStaff(req), function (err) {
        if (err) return next(err);

        return res.redirect('/manage');
    })
};

exports.services = function (req, res, next) {
    if (req.params.id) {
        models.shop.findOne({_id: req.params.id})
            .populate('services')
            .exec(function (err, shop) {
                if (err) return next(err);

                return res.render('manage/services', {
                    title: shop.name,
                    shop: shop
                })
            })
    } else {
        return res.redirect('/manage');
    }
};

exports.service = function (req, res, next) {
    if (req.params.eid) {
        // TODO: find the shop and get all staffs
        // BUG: how to get the shop id?
        models.service.findOne({_id: req.params.eid})
            .populate('staffs')
            .exec(function (err, service) {
                if (err) return next(err);

                return res.render('manage/service', {
                    title: service.name,
                    service: service
                })
            })
    } else {
        // get staff list in the shop
        models.shop.findOne({_id: req.params.id})
            .populate('staffs')
            .exec(function (err, shop) {
                res.render('manage/service', {
                    title: '新建服务项目',
                    staffs: shop.staffs
                })
            });
    }
};

function createService(req) {
    logger.debug(req.body);

    return {
        name: req.body.name,
        enabled: req.body.enabled == 'on',
        icon: req.body.icon,
        duration: parseInt(req.body.duration),
        price: parseInt(req.body.price),
        original: parseInt(req.body.original),
        intro: req.body.intro,
        shop: req.params.id,
        staffs: req.body.staffs
    };
};

exports.service_create = function (req, res, next) {
    models.service.create(createStaff(req), function (err, result) {
        if (err) return next(err);

        logger.debug(result.toObject());
        models.shop.findOneAndUpdate({_id: req.params.id}, {$addToSet: {services: result}}, function (err) {
            if (err) return next(err);

            return res.redirect('/manage/shop/' + req.params.id + '/services');
        })
    })
};

exports.service_update = function (req, res, next) {
    var service = createStaff(req);

    // TODO: update staffs, current ignore staffs
    delete service.staffs

    models.service.update({_id: req.body._id}, service, function (err) {
        if (err) return next(err);

        return res.redirect('/manage');
    })
};

exports.consumes = function (req, res, next) {
    models.order.find({'state': 'used'})
        .populate('service')
        .exec(function (err, orders) {
            if (err) return next(err);

            return res.render('manage/consumes', {
                orders: lodash.filter(orders, function (item) {
                    return item.service.shop.toString() == req.params.id;
                })
            });
        })
};

exports.consume = function (req, res) {
    return res.render('manage/consume');
};

exports.consume_post = function (req, res, next) {
    logger.debug(req.body);

    models.order.findOne({code: req.body.code, state: 'unused'}, function (err, order) {
        if (err) return next(err);

        if (!order) {
            return res.render('manage/consume_fail');
        }

        order.state = 'used';
        order.used = Date.now();
        order.save(function (err) {
            if (err) return next(err);

            return res.render('manage/consume_success');
        })
    });
};