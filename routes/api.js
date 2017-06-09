require('express-namespace');

const express = require('express');
const path = require('path');

const load = (name) => {
    return require(path.resolve('app/controllers/' + name));
};

const api = (app) => {

    app.namespace('/api', () => {
        const testController = load('testController');

        app.get('/', testController.test100);
    });
};

exports = module.exports = api;
