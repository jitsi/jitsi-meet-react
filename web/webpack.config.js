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
        filename: '[name].[hash].js',
        path: __dirname + '/dist',
        publicPath: '/'
    },
    cache: true,
    debug: true,
    devtool: false,
    entry: {
        app: __dirname + '/../src/index.web.js',
        config: __dirname + '/injected.config.js'
    },
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        Config,
        new HtmlWebPackPlugin({
            inject: 'body',
            filename: 'index.html',
            template: __dirname + '/index.template.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

