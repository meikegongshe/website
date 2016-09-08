exports = module.exports = function (req, res, next) {
    res.render('index', {locals: {title: 'meike'}});
}