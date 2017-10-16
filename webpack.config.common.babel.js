/**
 * Created by zzzz on 27/08/2017.
 */
const path = require("path");

module.exports = {
    entry: {
        main: [
            "./src/index.js"
        ]
    },
    output: {
        publicPath: "/",
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            // modules: true,
                            // localIdentName: "[local]-[hash:base64:6]"
                        }
                    }, {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },

    resolve: {
        alias: {
        }
    },

    plugins: []
};