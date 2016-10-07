var mongoose = require('mongoose'),
    service = require('./service'),
    staff = require('./staff');

var schema = new mongoose.Schema({
    name: {type: String},
    intro: {type: String},
    phone: {type: String},
    address: {type: String},
    location_x: {type: Number},
    location_y: {type: Number},
    images: [{type: String}],
    services: [{type: mongoose.Schema.Types.ObjectId, ref: 'service'}],
    staffs: [{type: mongoose.Schema.Types.ObjectId, ref: 'staff'}],
    added: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

schema.pre('save', function (next) {
    this.updated = Date.now;
    next();
});

mongoose.model('shop', schema);

schema = new mongoose.Schema({
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    shop: {type: mongoose.Schema.Types.ObjectId, ref: 'shop'},
    role: {type: String}
});

mongoose.model('shopManager', schema);