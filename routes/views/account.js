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
    return res.render('account/index', {
        title: '个人信息',
        account: account,
        footer_index: 4
    })
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
    var id = req.params.id;
    if (id) {
        return res.render('account/order', {
            title: id + ' 订单详情',
            members: account.orders,
            footer_index: 4
        })
    } else {
        var orders = lodash.groupBy(account.orders, function (order) {
            return order.service.shop.name;
        });

        var unpaid = lodash.groupBy(lodash.filter(account.orders, {state: '未支付'}), function (order) {
            return order.service.shop.name;
        });

        var unused = lodash.groupBy(lodash.filter(account.orders, {state: '未消费'}), function (order) {
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
}