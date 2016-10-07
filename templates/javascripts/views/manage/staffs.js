exports.init = function () {
    var staff_create = $('[data-type="staff-create"]');
    if (staff_create) {
        staff_create.click(function () {
            location.href = '/manage/shop/' + staff_create.attr('data-id') + '/staff';
        })
    }
};