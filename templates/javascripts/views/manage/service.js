exports.init = function () {
    var service_create = $('[data-type="service-confirm"]');
    var service_form = $('[data-type="service-form"]');
    if (service_create && service_form) {
        service_create.click(function () {
            service_form.submit();
        })
    }
};