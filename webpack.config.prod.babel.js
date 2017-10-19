const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require("./webpack.config.common.babel.js");

module.exports = {
    ...webpackConfig,
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ])
    },
    plugins: webpackConfig.plugins.concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": '"production"',
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html.ejs',
            hash: true
        }),
    ])
};