exports = module.exports = exports.index = function (req, res) {
    return res.render('commune/index', {
        title: '美丽公社',
        footer_index: 2
    })
};