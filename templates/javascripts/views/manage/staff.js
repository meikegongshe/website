exports.init = function () {
    var staff_create = $('[data-type="staff-confirm"]');
    var staff_form = $('[data-type="staff-form"]');
    if (staff_create && staff_form) {
        staff_create.click(function () {
            staff_form.submit();
        })
    }
};