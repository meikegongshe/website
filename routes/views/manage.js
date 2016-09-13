exports = module.exports = function (req, res) {
    switch (req.path) {
        case '/shop':
            return req.method === 'POST' ? postShopInfo(req.body) : getShopInfo();

        default :
            return res.render('manage/index', {
                title: '美客公社后台管理'
            });
    }

    function getShopInfo() {
        return res.render('manage/shop', {
            title: '店铺基本信息'
        })
    }

    function postShopInfo(data) {

    }
};