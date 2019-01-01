/**
 * Created by nnnyyy on 2018-11-21.
 */

const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const nodeExternals = require('webpack-node-externals');

const env = process.env.NODE_ENV;
const sourceMap = env === 'development' ? 'inline-source-map' : '';

const devServerConfig = {
    proxy: {
        "**": "http://127.0.0.1:10001"
    }
};

const cssLoader = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
};

const vueLoader = {
    test: /\.vue$/,
    loader: 'vue-loader',
    include: [ path.join(__dirname,"src")]
};

const babelLoader = {
    test: /\.js$/,
    loader: 'babel-loader',
    include: [ path.join(__dirname,"src")]
};

const config = {
    context: path.join(__dirname, "src"),
    entry: "./main.js",
    devtool: sourceMap,
    externals: {
        'vue': 'Vue',
        'jquery': '$',
        'lodash': '_'
    },
    devServer: devServerConfig,
    module: {
        rules: [
            cssLoader,
            vueLoader,
            babelLoader
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}

module.exports = config;