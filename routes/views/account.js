var models = require('../../models');

var account = {
    name: '我是用户',
    role: 'user',
    portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
    points: 121,
    records: 359,
    members: [{
        name: '我是一个下级会员',
        role: 'user',
        portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        points: 99,
        records: 101,
        members: []
    }, {
        name: '我是另一个下级会员',
        role: 'user',
        portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        points: 24,
        records: 1321,
        members: []
    }],
    orders: [{
        service: {
            _id: 101,
            name: '高级洗剪吹',
            icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
            shop: {
                _id: 1,
                name: '美客公社旗舰店'
            }
        },
        price: 365,
        state: '未支付'
    }, {
        service: {
            _id: 103,
            name: '特殊洗剪吹',
            icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
            shop: {
                _id: 1,
                name: '美客公社旗舰店'
            }
        },
        price: 365,
        state: '未消费'
    }, {
        service: {
            _id: 104,
            name: '随便洗剪吹',
            icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
            shop: {
                _id: 1,
                name: '美客公社旗舰店'
            }
        },
        price: 365,
        state: '已消费'
    }]
};


exports = module.exports = exports.index = function (req, res) {
    if (req.isAuthenticated()) {
        return res.render('account/index', {
            title: '个人信息',
            account: req.user,
            footer_index: 4
        })
    } else {
        return res.send("Please logon first");
    }
};

exports.member = function (req, res) {
    var id = req.params.id;
    if (id) {
        return res.render('account/member', {
            title: id + ' 的下级会员',
            members: account.members,
            footer_index: 4
        })
    } else {
        return res.render('account/member', {
            title: '我的下级会员',
            members: account.members,
            footer_index: 4
        })
    }
};

exports.order = function (req, res) {
    models.order.find({account: req.user._id})
        .populate({path: 'service', populate: {path: 'shop'}})
        .exec(function (err, results) {
            if (err) return next(err);

            // TODO: get shop name
            logger.debug(results);

            var id = req.params.id;
            if (id) {
                return res.render('account/order', {
                    title: id + ' 订单详情',
                    members: results,
                    footer_index: 4
                })
            } else {
                var orders = lodash.groupBy(results, function (order) {
                    return order.service.shop.name;
                });

                var unpaid = lodash.groupBy(lodash.filter(results, {state: 'unpaid'}), function (order) {
                    return order.service.shop.name;
                });

                var unused = lodash.groupBy(lodash.filter(results, {state: 'unused'}), function (order) {
                    return order.service.shop.name;
                });

                return res.render('account/order', {
                    title: '我的订单',
                    orders: orders,
                    unpaid: unpaid,
                    unused: unused,
                    footer_index: 4
                })
            }
        })
};

exports.phone = function (req, res) {
    return res.render('account/phone', {
        title: '绑定电话号码'
    })
};

exports.phone_post = function (req, res, next) {
    logger.debug(req.body);

    // TODO: add code verification

    models.account.findByIdAndUpdate(req.user._id, {$set: {phone: req.body.phone}}, function (err) {
        if (err) return next(err);

        req.user.phone = req.body.phone;

        if (req.query.redirectUrl) {
            return res.redirect(req.query.redirectUrl);
        } else {
            return res.redirect('/account');
        }
    });
};

exports.pay = function (req, res, next) {
    models.order.findOne({_id: req.params.id})
        .populate('service')
        .exec(function (err, order) {
            if (err) return next(err);

            require('../../components/pay').createOrder(req, order, function (err, data) {
                return res.render('account/pay', {
                    title: '支付订单',
                    order: order,
                    payArgs: data
                })
            })
        })
}