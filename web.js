var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    keystone = require('keystone'),
    engine = require('swig');

require('dotenv').config();

keystone.set('app', app);
keystone.set('mongoose', mongoose);

keystone.init({
    'name': 'meike',
    'brand': 'meike',

    'favicon': 'public/favicon.ico',
    'less': 'public',
    'static': ['public'],

    'views': 'templates/views',
    'custom engine': engine.renderFile,
    'view engine': 'html',

    'auto update': true,
    //'mongo': 'mongodb://localhost/liuxue',

    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': '55707ff95425e39eb694e537cffe86d1',        // v-liuxue md5

    'session store': 'connect-redis',
    'session store options': {
        "host": process.env.REDIS_HOST, // Redis服务器主机名
        "port": process.env.REDIS_PORT  // Redis服务器端口
    },

    'signin url': '/signin',
    'signin redirect': '/account',
    'signout url': '/signout',
    'signout redirect': '/',

    'wysiwyg images': true,
});

require('./models');

keystone.set('routes', require('./routes'));

keystone.start({
    onHttpServerCreated: function () {
        var server = keystone.httpServer;
        //console.log(server);
    }
});