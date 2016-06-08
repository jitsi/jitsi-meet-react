var WebPack = require('webpack');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var HtmlWebPackTemplate = require('html-webpack-template');


var NODE_ENV = process.env.NODE_ENV || 'development';
var isDevelopment = NODE_ENV === 'development';



var Config = new WebPack.NormalModuleReplacementPlugin(
    /^config$/,
    __dirname + '/config/' + NODE_ENV + '.js'
);



module.exports = {
    output: {
        filename: '[name].[hash].js',
        path: __dirname + '/dist',
        publicPath: '/'
    },
    cache: true,
    debug: true,
    devtool: false,
    entry: {
        app: __dirname + '/index.web.js'
    },
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        Config,
        new HtmlWebPackPlugin({
            template: HtmlWebPackTemplate,
            inject: false,

            title: 'Jitsi Meet App',
            favicon: __dirname + '/static/favicon.ico',
            filename: 'index.html',
            appMountId: 'app',
            mobile: true
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

