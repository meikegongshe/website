var models = require('../../models'),
    http = require('http');

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

                var used = lodash.groupBy(lodash.filter(results, {state: 'used'}), function (order) {
                    return order.service.shop.name;
                });

                logger.debug('unused:' + JSON.stringify(unused));
                logger.debug('used:' + JSON.stringify(used));

                return res.render('account/order', {
                    title: '我的订单',
                    orders: orders,
                    unpaid: unpaid,
                    unused: unused,
                    used: used,
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

    // code verification
    var vstr = req.body.phone + req.body.code;
    if(!req.session.vcode || req.session.vcode != vstr) {
        logger.debug('binding phone failed: ' + vstr + ' [expected] ' + req.session.vcode);

        return res.redirect('/account/phone_fail');
    }

    delete  req.session.vcode;

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

exports.phone_fail = function (req, res) {
    return res.render('account/phone_fail', {
        title: '绑定电话号码失败'
    })
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
};

exports.pay_success = function (req, res, next) {
    // generate consumer code
    generateCode(function (err, code) {
        if (err) return next(err);

        models.order.update({_id: req.params.id}, {
            $set: {
                code: code,
                paid: Date.now(),
                state: 'unused'
            }
        }, function (err) {
            if (err) return next(err);

            return res.render('account/pay_success', {
                title: '支付成功',
                code: code
            })
        })
    })
};

exports.pay_fail = function (req, res) {
    return res.render('account/pay_fail', {
        title: '支付失败'
    })
};

exports.consume = function (req, res, next) {
    models.order.findOne({_id: req.params.id}, function (err, order) {
        if (err) return next(err);

        return res.render('account/consume', {
            title: '消费代码',
            order: order
        })
    })
};

exports.phone_vcode = function (req, res, next) {
    var phone = req.params.phone,
        code = generateCode(6);
    req.session.vcode = phone + generateCode(6);
    var content = '美客公社验证码：' + code + '，过期无效';

    logger.debug('binding phone: ' + phone + ' code: ' + code);

    var options = {
        hostname: 'sz.ipyy.com',
        port: 80,
        path: '/sms.aspx?action=send&userid=&account=szzd0076&password=szzd0076&mobile=' + phone + '&content=' + content + '&sendTime=&extno=',
        method: 'GET'
    };

    logger.debug(options);

    http.request(options, function(result){
        logger.debug('STATUS: ' + result.statusCode);
        logger.debug('HEADERS: ' + JSON.stringify(result.headers));
        result.setEncoding('utf8');
        result.on('data', function (chunk) {
            logger.debug('BODY: ' + chunk);
        });
    }).end();

    return res.json();
};

function generateCode(count) {
    var code = '';

    for (var i = 0; i < count; ++i) {
        code += Math.floor(Math.random() * 10).toString();
    }

    return code;
}

function generateConsumeCode(callback) {
    var code = generateCode(12);

    models.order.count({code: code}, function (err, count) {
        if (err) return callback(err);

        if (count > 0) return generateCode(callback);

        return callback(null, code);
    })
}