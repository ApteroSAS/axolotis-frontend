const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: path.join(__dirname, "page/Index.ts")
    },
    experiments:{
        asyncWebAssembly:true,
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    resolve: {
        alias: {
            three: path.resolve("./node_modules/three"),
            "@root": path.resolve("./src")
        },
        fallback: {
            'fs': false,
            'path': false, // ammo.js seems to also use path
        },
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "assets/js/[name]-[chunkhash].js",
        path: path.resolve(__dirname, "../../dist/")
    },
    optimization: {
        minimize:true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "page/index.html"),
            chunks: ["index"],
            chunksSortMode: "manual",
            minify: {
                removeComments: true
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "src/assets/static/", to: "assets/static/" }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "src/assets/favicon.ico", to: "favicon.ico" }
            ]
        })
    ]
};
