var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String},
    role: {type: String, default: 'user'},
    portrait: {type: String},
    phone: {type: String},
    parent: [{type: mongoose.Schema.Types.ObjectId, ref: 'account'}],
    points: {type: Number, default: 0},
    records: {type: Number, default: 0},
    added: {type: Date, default: Date.now},
    ticket: {type: String},
    expireDate: {type: Date}
});

mongoose.model('account', schema);

schema = new mongoose.Schema({
    type: {type: String},
    uid: {type: String},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'}
});

mongoose.model('thirdAccount', schema);