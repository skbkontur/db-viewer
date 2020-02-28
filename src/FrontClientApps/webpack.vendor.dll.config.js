/* eslint-disable */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const fs = require("fs");
const utils = require("../Front/build-utils");
var fsExtra = require("fs-extra");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "babel.config.json")));

function createConfigForEnvironment(environment) {
    fsExtra.ensureDirSync(path.join(__dirname, "prebuild", environment));

    const PROD = environment === "production";
    const DEV = environment === "development"; // eslint-disable-line no-unused-vars
    const TEST = environment === "test";

    const result = {
        entry: {
            vendor: [
                "./src/Commons/DisableNativePromises.tsx",
                "core-js",
                "regenerator-runtime",
                ...(PROD ? [] : [require.resolve("../../Assemblies/SeleniumTesting/react-selenium-testing.js")]),
                "km-tracker",
                "whatwg-fetch",
                "react",
                "react-dom",
                "redux",
                "redux-thunk",
                "react-redux",
                "react-router",
                "react-router-dom",
                "react-router-redux",
                "copy-to-clipboard",
                "decimal.js",
                "immutable",
                "invariant",
                "jsbarcode",
                "numeral",
                "@skbkontur/react-ui-validations",
                "@skbkontur/react-ui/components/Autocomplete",
                "@skbkontur/react-ui/components/Button",
                "@skbkontur/react-ui/components/Center",
                "@skbkontur/react-ui/components/Checkbox",
                "@skbkontur/react-ui/components/ComboBoxOld",
                "@skbkontur/react-ui/components/DatePicker",
                "@skbkontur/react-ui/components/DateSelect",
                "@skbkontur/react-ui/components/Dropdown",
                "@skbkontur/react-ui/components/FxInput",
                "@skbkontur/react-ui/components/Gapped",
                "@skbkontur/react-ui/components/Group",
                "@skbkontur/react-ui/components/Input",
                "@skbkontur/react-ui/components/Kebab",
                "@skbkontur/react-ui/components/Link",
                "@skbkontur/react-ui/components/Loader",
                "@skbkontur/react-ui/components/Modal",
                "@skbkontur/react-ui/components/Radio",
                "@skbkontur/react-ui/components/RadioGroup",
                "@skbkontur/react-ui/components/RenderContainer",
                "@skbkontur/react-ui/components/ScrollContainer",
                "@skbkontur/react-ui/components/Select",
                "@skbkontur/react-ui/components/SidePage",
                "@skbkontur/react-ui/components/Spinner",
                "@skbkontur/react-ui/components/Switcher",
                "@skbkontur/react-ui/components/Textarea",
                "@skbkontur/react-ui/components/MenuItem",
                "@skbkontur/react-ui/components/MenuSeparator",
                "@skbkontur/react-ui/components/Hint",
                "@skbkontur/react-ui/components/Logotype",
                "@skbkontur/react-ui/components/TopBar",
                "@skbkontur/react-ui/components/RenderLayer",
                "@skbkontur/react-ui/components/Toast",
                "@skbkontur/react-ui/components/Sticky",
                "@skbkontur/react-ui/components/Tabs",
                "@skbkontur/react-ui/components/Tooltip",
                "@skbkontur/react-ui/components/Paging",
                "@skbkontur/react-ui/lib/pluralize.js",
                "lodash",
                "moment",
                "moment/locale/ru",
                "qs",
                "@skbkontur/certificates-list",
                "@skbkontur/plugin-js",
                "axios",
                "date-fns",
                "db-viewer-ui",
            ],
        },
        output: {
            path: path.join(__dirname, "prebuild", environment),
            publicPath: "/dist/",
            filename: PROD || TEST ? "[name].[hash].js" : "[name].js",
            library: "vendor",
        },
        module: {
            rules: [
                {
                    test: [/\.jsx?$/, /\.tsx?$/],
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: path.join(__dirname, ".babel-cache", "dll-vendor"),
                            ...babelConfig,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    exclude: /node_modules/,
                    rules: [
                        {
                            use: ["classnames-loader"],
                        },
                        {
                            use: [
                                PROD || TEST
                                    ? MiniCssExtractPlugin.loader
                                    : { loader: "style-loader", options: { base: 1000 } },
                                PROD || TEST
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
                    test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                    exclude: /node_modules/,
                    use: ["file-loader"],
                },
                {
                    test: /\.(c|le)ss$/,
                    include: /db-viewer-ui/,
                    exclude: /db-viewer-ui(\\|\/)node_modules/,
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
                    test: /\.(c|le)ss$/,
                    include: /react-(ui|icons)/,
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
                    ],
                },
                {
                    test: /\.(css)$/,
                    use: [
                        PROD || TEST ? MiniCssExtractPlugin.loader : "style-loader",
                        {
                            loader: "css-loader",
                            options: { modules: true },
                        },
                    ],
                    include: /certificates-list/,
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
            ],
        },
        resolve: {
            modules: ["node_modules", "local_modules", "web_modules"],
            extensions: [".js", ".jsx"],
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
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
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(ru)$/),
            new webpack.DllPlugin({
                name: "vendor",
                path: "prebuild/" + environment + "/vendor-manifest.json",
            }),
            new webpack.DefinePlugin({
                "process.env.enableReactTesting": JSON.stringify(TEST || DEV),
                "process.env.NODE_ENV": JSON.stringify(environment),
            }),
            new MiniCssExtractPlugin({
                filename: PROD || TEST ? "[name].[hash].css" : "[name].css",
            }),
            utils.dotNetEntryAssetsFilePlugin(
                path.join(__dirname, "prebuild", environment, "webpack-vendor-assets.json")
            ),
        ],
        mode: PROD || TEST ? "production" : "development",
    };

    if (PROD || TEST) {
        result.plugins = result.plugins || [];
        result.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    } else {
        result.plugins.push(new webpack.NamedModulesPlugin());
        result.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return result;
}

module.exports = [
    createConfigForEnvironment("production"),
    createConfigForEnvironment("development"),
    createConfigForEnvironment("test"),
];
