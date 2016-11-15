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

schema = new mongoose.Schema({
    access_token: {type: String},
    expires_in: {type: Number},
    refresh_token: {type: String},
    openid: {type: String},
    scope: {type: String},
    create_at: {type: String}
});

schema.statics.getToken = function (openid, callback) {
    this.findOne({openid: openid}, callback);
};

schema.statics.setToken = function (openid, token, callback) {
    var query = {openid: openid};
    var options = {upsert: true};
    this.update(query, token, options, callback);
};

mongoose.model('wechatToken', schema);