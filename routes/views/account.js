var account = {
    name: '我是用户',
    role: 'user',
    portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
    points: 121,
    records: 359,
    children: [{
        name: '我是一个下级会员',
        role: 'user',
        portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        points: 99,
        records: 101,
        children:[]
    },{
        name: '我是另一个下级会员',
        role: 'user',
        portrait: 'http://www.qqtn.com/file/2011/2011-6/20116620201106269449.jpg',
        points: 24,
        records: 1321,
        children:[]
    }]
};


exports = module.exports = exports.index = function (req, res) {
    return res.render('account/index', {
        title: '个人信息',
        account: account
    })
};