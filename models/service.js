var mongoose = require('mongoose'),
    staff = require('./staff');

var schema = new mongoose.Schema({
    name: {type: String},
    type: {type: String},
    price: {type: String},
    original: {type: String},
    intro: {type: String},
    staffs: [staff],
    enabled: {type: Boolean, default: true},
    added: {type: Date, default: Date.now}
});

mongoose.model('service', schema);