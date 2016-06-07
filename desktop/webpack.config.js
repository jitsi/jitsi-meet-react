var WebPack = require('webpack');
var HtmlWebPackPlugin = require('html-webpack-plugin');


var NODE_ENV = process.env.NODE_ENV || 'development';
var isDevelopment = NODE_ENV === 'development';



var Config = new WebPack.NormalModuleReplacementPlugin(
    /^config$/,
    __dirname + '/' + NODE_ENV + '.config.js'
);



module.exports = {
    output: {
        filename: '[name].js',
        path: __dirname + '/../dist/desktop',
        publicPath: '/'
    },
    cache: true,
    debug: true,
    devtool: false,
    entry: {
        app: __dirname + '/../src/index.desktop.js',
        config: __dirname + '/injected.config.js'
    },
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        Config,
        new HtmlWebPackPlugin({
            inject: false,
            filename: 'index.html',
            template: __dirname + '/index.template.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};

