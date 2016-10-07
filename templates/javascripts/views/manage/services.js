exports.init = function () {
    var service_create = $('[data-type="service-create"]');
    if (service_create) {
        service_create.click(function () {
            location.href = '/manage/shop/' + service_create.attr('data-id') + '/service';
        })
    }
};