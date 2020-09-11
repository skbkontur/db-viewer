/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");

module.exports = function (env) {
    return {
        context: __dirname,
        entry: { root: require.resolve("./index.tsx") },
        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "/dist/",
            filename: "[name].js",
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    use: {
                        loader: require.resolve("babel-loader"),
                        options: {
                            plugins: [require.resolve("react-refresh/babel")],
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    use: [
                        require.resolve("style-loader"),
                        {
                            loader: require.resolve("css-loader"),
                            options: {
                                modules: {
                                    localIdentName: "[name]-[local]-[hash:base64:4]",
                                },
                            },
                        },
                        require.resolve("less-loader"),
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                    loader: require.resolve("url-loader"),
                },
            ],
        },
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.API": JSON.stringify(env.api || "real"),
                "process.env.NODE_ENV": JSON.stringify("development"),
                "process.env.enableReactTesting": JSON.stringify(true),
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
        ],
        mode: "development",
        devServer: {
            hot: true,
            host: "0.0.0.0",
            port: 8080,
            proxy: {
                "/db-viewer/**": {
                    target: "http://localhost:5000/",
                },
                "*": {
                    secure: false,
                    bypass: () => "/public/index.html",
                },
            },
            stats: {
                colors: true,
                hash: false,
                version: false,
                timings: true,
                assets: false,
                chunks: false,
                modules: false,
                reasons: false,
                children: false,
                source: false,
                errors: true,
                errorDetails: true,
                warnings: true,
                publicPath: false,
            },
        },
    };
};
