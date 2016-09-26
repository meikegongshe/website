var mongoose = require('mongoose'),
    staff = require('./staff');

var schema = new mongoose.Schema({
    name: {type: String},
    type: {type: String},
    price: {type: Number},
    original: {type: Number},
    intro: {type: String},
    staffs: [{type: mongoose.Schema.Types.ObjectId, ref: 'staff'}],
    enabled: {type: Boolean, default: true},
    added: {type: Date, default: Date.now}
});

mongoose.model('service', schema);