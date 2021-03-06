var mongoose = require('mongoose'),
    staff = require('./staff');

var schema = new mongoose.Schema({
    name: {type: String},
    title: {type: String},
    portrait: {type: String},
    type: {type: String},
    intro: {type: String},
    shop: {type: mongoose.Schema.Types.ObjectId, ref: 'shop'},
    added: {type: Date, default: Date.now}
});

mongoose.model('staff', schema);