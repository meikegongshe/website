exports.init = function(){
    // init service list
    var serviceList = $('#service_list li');
    if (serviceList) {
        serviceList.click(function () {
            location.href = '/shop/service/' + $(this).attr('data-id');
        })
    }
}