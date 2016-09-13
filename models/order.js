var mongoose = require('mongoose'),
    user = require('./user'),
    service = require('./service');

var schema = new mongoose.Schema({
    user: user,
    service: service,
    price: {type: String},
    state: {type: String},
    paid: {type: Date},
    schedule: {type: Date},
    added: {type: Date, default: Date.now}
});

mongoose.model('order', schema);