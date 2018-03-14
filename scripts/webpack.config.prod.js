const paths = require('./paths');

const options = { prod: true };
const webpackLoader = require('./webpack.loader')(options);
const webpackPlugins = require('./webpack.plugin')(options);

const config = {
    context: paths.appBuild,

    entry: {
        index: [paths.appIndex],
    },

    output: {
        filename: '[name].bundle.js',
        path: paths.appBuild,
        publicPath: '/public/dist/'
    },

    module: {
        rules: webpackLoader
    },
    plugins: webpackPlugins,
}


module.exports = config;