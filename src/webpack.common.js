const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: path.join(__dirname, "Index.ts")
    },
    experiments:{
        asyncWebAssembly:true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
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
        path: path.resolve(__dirname, "../dist/")
    },
    optimization: {
        minimize:true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            template: path.join(__dirname, "index.html"),
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
                {from: "node_modules/ammo.js/builds/ammo.wasm.wasm", to: "assets/js/ammo.wasm.wasm" }
            ]
        })
    ]
};
