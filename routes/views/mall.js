exports = module.exports = exports.index = function (req, res) {
    return res.render('mall/index', {
        title: '积分商城',
        footer_index: 3
    })
};