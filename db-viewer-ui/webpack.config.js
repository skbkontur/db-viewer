/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

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
                    use: require.resolve("babel-loader"),
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
            }),
            new webpack.NamedModulesPlugin(),
        ],
        mode: "development",
        devServer: {
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
