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
                "./src/Commons/DisableNativePromises.tsx",
                "core-js",
                "regenerator-runtime",
                "./local_modules/ui/metrics/init.ts",
                require.resolve("core-js/features/array/flat.js"),
                "whatwg-fetch",
                "./react-selenium-testing-config.js",
                require.resolve("../../Assemblies/SeleniumTesting/react-selenium-testing.js"),
                "moment",
                "moment/locale/ru",
            ],
            "supplier-web": "./src/SupplierWeb/index",
            "legacy-price-list-delivery-points": "./src/PriceLists/index",
            createPriceLightbox: "./src/BuyerSelectLightbox/components/index",
            "legacy-admin-toolbar": "./src/ServiceHeader/legacy-admin-toolbar",
            "legacy-edi-topbar": "./src/ServiceHeader/legacy-edi-topbar",
            "legacy-footer": "./src/ServiceHeader/legacy-footer",
            "legacy-edi-navigation": "./src/ServiceHeader/legacy-edi-navigation",
            root: "./src/index",
            "legacy-help-links": "./src/SupplierWeb/legacy-help-links",
            "legacy-amendment-requested-tooltip": "./src/SupplierWeb/legacy-amendment-requested-tooltip",
            "legacy-limited-error-list": "./src/SupplierWeb/legacy-limited-error-list",
            "draft-invoic-reset-package-level-button": "./src/SupplierWeb/draft-invoic-reset-package-level-button",
            "certificates-list": "./src/SupplierWeb/certificates-list",
			"legacy-side-menu-banner": "./src/SupplierWeb/components/SideMenuBanner/legacy-side-menu-banner",
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
            modules: ["node_modules", "local_modules"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
                Domain: path.join(__dirname, "src/Domain"),
                Commons: path.join(__dirname, "src/Commons"),
                assets: path.join(__dirname, "assets"),
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
                                name.endsWith("variables.less") ||
                                name.endsWith("mixins.less")
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
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require("./prebuild/" + NODE_ENV + "/vendor-manifest.json"),
            }),
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
                "/IncidentsProxy/**": bypassNetSuiteApi("/IncidentsProxy/**"),
                "/internal-api/**": {
                    target: "http://localhost.dev.kontur:2233/",
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

function bypassNetSuiteApi() {
    // Написано экспериментальным путём (для webpack-dev-server 1.14), возможно есть решение лучше
    return {
        target: "https://rest.na1.netsuite.com",
        secure: false,
        headers: {
            ["content-type"]: "application/json",
            ["Authorization"]:
                "NLAuth nlauth_account=3883090, nlauth_email=vip@edi.kontur.ru, nlauth_signature=LYKtITWlqbP6Aw, nlauth_role=3",
        },
        changeOrigin: true,
        bypass: function(req, res, options) {
            if (mm.isMatch(req.originalUrl, options.context)) {
                req.url =
                    "https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?deploy=1" +
                    "&" +
                    req.url.replace("/IncidentsProxy/?", "");
            }
        },
    };
}

function remoteApi(host) {
    return {
        target: "https://" + host + "/",
        secure: false,
        headers: {
            host: host,
        },
        bypass: function(req, res, proxyOptions) {
            if (fs.existsSync("auth.sid")) {
                var auth = fs.readFileSync("auth.sid", { encoding: "utf8" });
                auth = auth.replace("\n", "");
                var cookie = req.headers.cookie;
                req.headers.cookie = cookie + "; auth.sid=" + auth;
            }
        },
    };
}

function serveStatic(pathToHtml) {
    return {
        secure: false,
        bypass: function(req, res, options) {
            if (mm.isMatch(req.originalUrl, options.context)) {
                return pathToHtml;
            }
        },
    };
}

function getOutputFilename(hashNames, ext) {
    return (hashNames ? "[name].[hash]." : "[name].") + ext;
}
