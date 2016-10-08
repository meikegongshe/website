exports.init = function () {
    var create = $('[data-type="phone-confirm"]');
    var form = $('[data-type="phone-form"]');
    if (create && form) {
        create.click(function () {
            form.submit();
        })
    }
}