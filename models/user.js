var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String},
    portrait: {type: String},
    phone: {type: String},
    parent: user,
    added: {type: Date, default: Date.now}
});

mongoose.model('user', schema);