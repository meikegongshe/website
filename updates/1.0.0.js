var models = require('../models'),
    q = require('q');

exports = module.exports = function (done) {
    models.account.where({}).count()
        .then(function (result) {
            if (result > 0) return done();

            // TODO: need a new init logic
            models.account.create({
                name: '管理员',
                role: 'user,manager,admin',
                portrait: 'http://img.hb.aicdn.com/a76d0ce8308e4a2ed83ef6edd73bcefa2f0d729611385-jWDAVf_fw658',
                phone: '12345678901'
            }).then(done);

            return;

            initStaff()
                .then(initService)
                .then(initShop)
                .then(function () {
                    logger.debug('initialization done');

                    return done();
                })
                .catch(function (err) {
                    return done(err);
                })
        })
        .catch(function (err) {
            return done(err);
        });

    function initStaff() {
        var deferred = q.defer();

        new models.staff({
            name: 'test',
            type: 'test',
            intro: 'This is a staff'
        }).save(function (err, data) {
                if (err) return deferred.reject(err);

                logger.debug('staff is created');
                return deferred.resolve(data);
            });

        return deferred.promise;
    }

    function initService(staff) {
        var deferred = q.defer();

        var staff = staff || [];
        if (!lodash.isArray(staff)) staff = [staff];

        new models.service({
            name: 'test',
            type: 'test',
            price: 100,
            original: 1000,
            intro: 'test',
            staffs: staff
        }).save(function (err, data) {
                if (err) return deferred.reject(err);

                logger.debug('service is created');
                return deferred.resolve(data);
            });

        return deferred.promise;
    }

    function initShop(services) {
        var deferred = q.defer();

        var services = services || [];
        if (!lodash.isArray(services)) services = [services];

        new models.shop({
            name: 'test',
            intro: 'test',
            phone: '123456789',
            address: 'test',
            location_x: 22.516858,
            location_y: 113.935550,
            images: [],
            services: services,
            staffs: lodash.flatten(lodash.map(services, 'staffs'))
        }).save(function (err, data) {
                if (err) return deferred.reject(err);

                logger.debug('shop is created');
                return deferred.resolve(data);
            });

        return deferred.promise;
    }
};