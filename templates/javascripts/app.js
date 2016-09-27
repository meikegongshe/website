$('document').ready(function () {
    console.log('page is ready');

    var serviceList = $('#service_list li');
    if(serviceList){
        serviceList.click(function () {
            location.href='/service/' + $(this).attr('data-id');
        })
    }
});