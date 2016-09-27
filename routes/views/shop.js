//var model = require('../../models');

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
    name: '美客公社',
    services: services,
    staffs: staffs
}

exports = module.exports = exports.index = function (req, res) {
    /*model.shop.findOne(function (err, data) {
     if (err || !data)return next(err);

     return res.render('index', getViewModel(data));
     });*/
    return res.render('index', {
        title: '美客公社',
        shop: shop
    });
};

exports.service = function (req, res) {
    var service = lodash.find(services, {_id: parseInt(req.params.id)});
    return res.render('shop/service', {
        title: service.name,
        service: service
    })
};