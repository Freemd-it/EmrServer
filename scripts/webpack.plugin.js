

const { LoaderOptionsPlugin, optimize: { ModuleConcatenationPlugin } } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackPlugins = (options) => {
    const { prod } = options;
    let plugins = [];
    if (prod) {
        plugins = [
            new UglifyJSPlugin({ sourceMap: true }),
        ];
    }
    const defaults = [
        new LoaderOptionsPlugin({ minimize: prod, debug: !prod }),
        new ExtractTextPlugin({ filename: '[name].css' }),
        new ModuleConcatenationPlugin(),
        new CaseSensitivePathsPlugin(),
    ];
    return defaults.concat(plugins);
};

module.exports = webpackPlugins;
