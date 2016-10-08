var mongoose = require('mongoose'),
    user = require('./account'),
    service = require('./service');

var schema = new mongoose.Schema({
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'service'},
    price: {type: String},
    state: {type: String, default: 'unpaid'},
    paid: {type: Date},
    schedule: {type: Date},
    added: {type: Date, default: Date.now}
});

mongoose.model('order', schema);