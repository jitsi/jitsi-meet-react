var WebPack = require('webpack');
var HtmlPlugin = require('html-webpack-plugin');
var HasteResolver = require('haste-resolver-webpack-plugin');

module.exports = {
    output: {
        filename: 'bundle.js',
        path: __dirname,
        publicPath: '/'
    },
    cache: true,
    debug: true,
    devtool: 'source-map',
    entry: {
        app: __dirname + '/index.web.js'
    },
    plugins: [
        new HasteResolver({
            platform: 'web'
        }),
        new HtmlPlugin({
            filename: 'index.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-1']
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            // Disable AMD for Strophe and its plugins because we don't know how
            // to require them successfully.
            {
                test: /\/strophe(js-plugins)?\//,
                loader: 'imports?define=>false&this=>window'
            }
        ]
    }
};
