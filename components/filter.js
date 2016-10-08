exports.state_str = function (input) {
    switch(input){
        case 'unpaid':
            return '未支付';

        case 'paid':
            return '已支付';

        case 'unused':
            return '未使用';

        case 'used':
            return '已使用';

        case 'done':
            return '已完成';

        default:
            return input;
    }
};