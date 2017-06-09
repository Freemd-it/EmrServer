'use strict';

require('express-namespace');

var express = require('express');
var path = require('path');

var load = function load(name) {
    return require(path.resolve('app/controllers/' + name));
};

var api = function api(app) {

    app.namespace('/api', function () {
        var testController = load('testController');

        app.get('/', testController.test100);
    });
};

exports = module.exports = api;
//# sourceMappingURL=api.js.map