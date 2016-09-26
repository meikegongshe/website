var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String},
    role: [{type: String}],
    portrait: {type: String},
    phone: {type: String},
    parent: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    added: {type: Date, default: Date.now}
});

mongoose.model('user', schema);