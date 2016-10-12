exports.init = function () {
    var member_btn = $('#members-btn');
    if (member_btn) {
        member_btn.click(function () {
            location.href = '/account/members';
        })
    }

    var unpaid = $('#unpaid-btn');
    if (unpaid) {
        unpaid.click(function () {
            location.href = '/account/orders#2';
        })
    }

    var unused = $('#unused-btn');
    if (unused) {
        unused.click(function () {
            location.href = '/account/orders#3';
        })
    }

    var refund = $('#refund-btn');
    if (refund) {
        refund.click(function () {
            location.href = '/account/orders#4';
        })
    }

    var manage = $('#manage-btn');
    if (manage) {
        manage.click(function () {
            location.href = '/manage';
        })
    }
};