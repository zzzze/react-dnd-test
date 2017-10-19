const webpack = require("webpack");
const webpackConfig = require("./webpack.config.common.babel.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    ...webpackConfig,
    entry: {
        main: webpackConfig.entry.main.concat([
            "webpack/hot/dev-server",
            "webpack-dev-server/client?http://localhost:8080/"
        ])
    },
    devtool: "#source-map",
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ["react-hot-loader", "babel-loader"/*, "eslint-loader"*/]
            }
        ])
    },
    devServer:{
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080,
        inline: true,
        hotOnly: true,
        hot: true,
        historyApiFallback:{
            index:"/index.html"
        }
    },
    plugins: webpackConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": '"development"',
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html.ejs',
        }),
    ])
};