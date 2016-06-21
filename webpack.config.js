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
    devtool: false,
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
            }
        ]
    }
};

