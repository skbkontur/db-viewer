/* eslint-disable */
const path = require("path");
const webpack = require("webpack");
const mm = require("micromatch");

module.exports = (dir, env) => {
    var NODE_ENV = process.env.NODE_ENV;
    var DEV = NODE_ENV === "development";
    var TEST = NODE_ENV === "test";
    var API_MODE = env.api || "real";
    var AREA_TYPE = env.area || "index";

    const config = {
        context: __dirname,
        entry: { root: "./src/index" },
        output: {
            path: path.resolve(dir, "dist"),
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
                        "classnames-loader",
                        "style-loader",
                        "css-loader?localIdentName=[name]-[local]-[hash:base64:4]",
                        "less-loader"
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
                Domain: path.join(__dirname, "src/Domain")
            },
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.API": JSON.stringify(API_MODE),
                "process.env.enableReactTesting": JSON.stringify(TEST || DEV),
                "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
            }),
            new webpack.NamedModulesPlugin(),
        ],
        mode: "development",
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

    return config;
};
