exports.init = function () {
    var create = $('[data-type="phone-confirm"]');
    var form = $('[data-type="phone-form"]');
    if (create && form) {
        create.click(function () {
            form.submit();
        })
    }

    var vcode = $('#send_vcode');
    if (vcode) {
        vcode.click(function () {
            var phone = $('[name="phone"]');
            if (!phone || phone.val() == '') return;
            if (vcode.css('color') == 'gray') return;

            $.get('/account/phone_vcode/' + phone.val());

            vcode.css('color', 'gray');
            var num = 60;
            vcode.text('已发送(' + num-- + ')');
            var timer = window.setInterval(function () {
                vcode.text('已发送(' + num-- + ')');
                if (num == 0) {
                    window.clearInterval(timer);
                    vcode.text('发送验证码');
                    vcode.css('color', '');
                }
            }, 1000);
        });
    }
};