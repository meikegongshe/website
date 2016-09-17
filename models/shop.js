var mongoose = require('mongoose'),
    service = require('./service'),
    staff = require('./staff');

var schema = new mongoose.Schema({
    name: {type: String},
    intro: {type: String},
    phone: {type: String},
    address: {type: String},
    location: {type: String},
    images: [{type: String}],
    services: [service],
    staffs: [staff],
    added: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

schema.pre('save', function (next) {
    this.updated = Date.now;
    next();
});

mongoose.model('shop', schema);