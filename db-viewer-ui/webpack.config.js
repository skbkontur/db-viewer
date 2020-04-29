/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const webpack = require("webpack");

module.exports = function (env) {
    const NODE_ENV = process.env.NODE_ENV;
    const API_MODE = env.api || "real";

    return {
        context: __dirname,
        entry: { root: "./index" },
        output: {
            path: path.resolve(__dirname, "dist"),
            publicPath: "/dist/",
            filename: "[name].js",
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    use: "babel-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: "[name]-[local]-[hash:base64:4]",
                                },
                            },
                        },
                        "less-loader",
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf)$/,
                    use: "file-loader",
                },
                {
                    test: /\.(svg|gif|png)$/,
                    use: "url-loader",
                },
            ],
        },
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
                Components: path.join(__dirname, "src/Components"),
                Containers: path.join(__dirname, "src/Containers"),
                Domain: path.join(__dirname, "src/Domain"),
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.API": JSON.stringify(API_MODE),
                "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
            }),
            new webpack.NamedModulesPlugin(),
        ],
        mode: "development",
        devServer: {
            proxy: {
                "/db-viewer/**": {
                    target: "http://localhost:5555/",
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
