/* eslint-disable */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const fs = require("fs");
const mm = require("micromatch");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "babel.config.json")));

module.exports = (dir, env, options) => {
    var NODE_ENV = process.env.NODE_ENV;
    var PROD = NODE_ENV === "production";
    var DEV = NODE_ENV === "development";
    var TEST = NODE_ENV === "test";
    var API_MODE = env.api || "real";
    var AREA_TYPE = env.area || "index";

    const opts = Object.assign(
        {
            plugins: [],
            hashNames: false,
            publicPath: "/dist/",
        },
        options || {}
    );

    const config = {
        context: __dirname,
        entry: {
            "commons-entry": [
                "core-js",
                "regenerator-runtime",
                require.resolve("core-js/features/array/flat.js"),
                "whatwg-fetch",
                "moment",
                "moment/locale/ru",
            ],
            root: "./src/index",
        },
        output: {
            path: path.resolve(dir, "dist"),
            publicPath: opts.publicPath,
            filename: getOutputFilename(opts.hashNames, "js"),
        },
        module: {
            rules: [
                {
                    test: [/\.jsx?$/, /\.tsx?$/],
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: path.join(__dirname, ".babel-cache", "source"),
                            ...babelConfig,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    rules: [
                        {
                            use: ["classnames-loader"],
                        },
                        {
                            use: [
                                PROD || TEST
                                    ? MiniCssExtractPlugin.loader
                                    : { loader: "style-loader", options: { base: 1000 } },
                                PROD
                                    ? "css-loader"
                                    : {
                                          loader: "css-loader",
                                          options: {
                                              localIdentName: "[name]-[local]-[hash:base64:4]",
                                          },
                                      },
                                "postcss-loader",
                                "less-loader",
                            ],
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf)$/,
                    include: /react-ui/,
                    exclude: /react-ui(\\|\/)node_modules/,
                    use: "file-loader",
                },
                {
                    test: /\.(svg|gif|png)$/,
                    include: /react-ui/,
                    exclude: /react-ui(\\|\/)node_modules/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 32768,
                            },
                        },
                    ],
                },
                {
                    test: /\.(svg|gif|png)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 32768,
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            modules: ["node_modules"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
                Domain: path.join(__dirname, "src/Domain")
            },
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    uglifyOptions: {
                        compress: {
                            reduce_funcs: false,
                            inline: false,
                        },
                        safari10: true,
                        mangle: !TEST,
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: (module, chunks) => {
                            if (typeof module.nameForCondition !== "function") {
                                return true;
                            }
                            const name = module.nameForCondition();
                            if (
                                name.endsWith("reset.less") ||
                                name.endsWith("typography.less") ||
                                name.endsWith("variables.less")
                            ) {
                                return false;
                            }
                            return true;
                        },
                        name: "commons",
                        chunks: "initial",
                        minChunks: 2,
                    },
                },
            },
        },
        plugins: [
            new CopyWebpackPlugin(
                [
                    {
                        context: path.join(__dirname, "prebuild", NODE_ENV),
                        from: "*",
                    },
                ],
                {
                    ignore: ["webpack-vendor-assets.json", "vendor-manifest.json"],
                }
            ),
            new webpack.DefinePlugin({
                "process.env.API": JSON.stringify(API_MODE),
                "process.env.enableReactTesting": JSON.stringify(TEST || DEV),
                "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
            }),
            new MiniCssExtractPlugin({
                filename: getOutputFilename(opts.hashNames, "css"),
            }),
            new CaseSensitivePathsPlugin(),
        ].concat(opts.plugins),
        mode: PROD || TEST ? "production" : "development",
        devServer: {
            proxy: {
                "/business-objects/**": {
                    target: "http://localhost:5555/",
                },
                "*": {
                    secure: false,
                    bypass: function(req, res, options) {
                        if (req.originalUrl.startsWith("/stories") || req.originalUrl.startsWith("/public")) {
                            return req.originalUrl;
                        }
                        if (mm.isMatch(req.originalUrl, options.context)) {
                            return `/public/${AREA_TYPE}.html`;
                        }
                    },
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

    if (PROD || TEST) {
        config.plugins = config.plugins || [];
        config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    }
    if (DEV) {
        config.plugins.push(new webpack.NamedModulesPlugin());
    }
    return config;
};

function getOutputFilename(hashNames, ext) {
    return (hashNames ? "[name].[hash]." : "[name].") + ext;
}
