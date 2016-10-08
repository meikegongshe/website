var models = require('../../models');

var service_intro = '我就是一段介绍文字，为了充斥版面，但是又不知道要写什么，于是我很纠结。纠结的我牙疼，于是我去刷了一下牙，结果，流血了。哭哭哭。我刷完牙，回来看到这段文字，还是不知道些什么，于是回去睡了。';

var staffs = [
    {
        portrait: 'http://d01.res.meilishuo.net/pic/r/ff/3a/1a8d54a5e426571fc6d348d94c57_300_300.c1.jpg',
        name: '老板',
        title: '首席美发师'
    },
    {
        portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        name: '总监',
        title: '美发师'
    },
    {
        portrait: 'http://img.ixiumei.com/uploadfile/2015/1222/thumb_200_200_20151222104819506.jpg',
        name: '员工',
        title: '洗发师'
    },
    {
        portrait: 'http://d01.res.meilishuo.net/pic/r/ff/3a/1a8d54a5e426571fc6d348d94c57_300_300.c1.jpg',
        name: '门卫',
        title: '专业看大门'
    }
];

var services = [
    {
        _id: 101,
        name: '高级洗剪吹',
        icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        price: 365,
        original: 1888,
        intro: service_intro,
        staffs: [staffs[0]]
    },
    {
        _id: 102,
        name: '一般洗剪吹',
        icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        price: 365,
        original: 1888,
        intro: service_intro,
        staffs: [staffs[0], staffs[1]]
    },
    {
        _id: 103,
        name: '特殊洗剪吹',
        icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        price: 365,
        original: 1888,
        intro: service_intro,
        staffs: [staffs[2], staffs[3]]
    },
    {
        _id: 104,
        name: '随便洗剪吹',
        icon: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        price: 365,
        original: 1888,
        intro: service_intro,
        staffs: [staffs[0], staffs[1], staffs[2]]
    }
];

var shop = {
    _id: 100,
    name: '美客公社旗舰店',
    intro: '这里是一段基本的商铺介绍，我觉得还是应该有一个简单的介绍的，以后支持详情了，可以点开更多查看。',
    address: '我也不知道这是个什么地址',
    phone: '12345678901',
    images: ['http://img.jdzj.com/UserDocument/2013c/chenjianmo/Picture/201392910266.jpg',
        'http://img.jdzj.com/UserDocument/2013c/chenjianmo/Picture/201392910266.jpg',
        'http://img.jdzj.com/UserDocument/2013c/chenjianmo/Picture/201392910266.jpg'],
    location_x: 22.517676,
    location_y: 113.935593,
    services: services,
    staffs: staffs
};

exports = module.exports = exports.index = function (req, res, next) {
    models.shop.findOne({_id: req.params.id})
        .populate(['staffs', 'services'])
        .exec(function (err, shop) {
            if (err)return next(err);

            return res.render('shop/index', {
                title: shop.name,
                shop: shop
            });
        });
};

exports.service = function (req, res, next) {
    models.service.findOne({_id: req.params.id})
        .populate('staffs')
        .exec(function (err, service) {
            if (err)return next(err);

            return res.render('shop/service', {
                title: service.name,
                service: service
            })
        })
};

exports.order = function (req, res, next) {
    if (req.user.phone) {
        models.service.findOne({_id: req.params.id}, function (err, service) {
            if (err)return next(err);
            if (!service) return next('Service is nonexistence');

            // add order
            models.order.create({
                account: req.user._id,
                service: service.id,
                price: service.price
            }, function (err, order) {
                if (err) return next(err);

                return res.redirect('/shop/pay/' + req.params.id);
            })
        });
    } else {
        return res.redirect('/account/phone?redirectUrl=' + req.originalUrl);
    }

    /*
    models.service.findOne({_id: req.params.id})
        .populate('staffs')
        .exec(function (err, service) {
            if (err)return next(err);

            return res.render('shop/order', {
                title: '提交订单',
                service: service
            });
        })
   */
};

exports.order_post = function (req, res) {
    // TODO: add handling logic
    return res.redirect('shop/pay');
};

exports.order_success = function (req, res) {
    return res.render('shop/pay', {
        title: '支付订单'
    })
};

exports.pay = function (req, res) {
};

exports._shop = shop;