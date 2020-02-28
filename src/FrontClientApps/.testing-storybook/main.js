// Если не заимпортить, будут дефолтные стили (k.solovei, 06.02.2020)
// import "ui/styles/reset.less";
// import "ui/styles/typography.less";

// TODO: выпилить этот сторибук вместе с puppeteer тестами
const path = require("path");
const fs = require("fs");
const webpack = require("@storybook/core/node_modules/webpack");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../babel.config.json")));

module.exports = {
    stories: ["../story-tests/**/*.{ts,tsx}"],
    addons: ["@storybook/addon-actions/register", "@storybook/addon-knobs/register"],
    webpackFinal: async (config, { configType }) => {
        config.entry.unshift(
            require.resolve("../react-selenium-testing-config.js"),
            require.resolve("../../../Assemblies/SeleniumTesting/react-selenium-testing.js")
        );
        config.module.rules = [];
        config.module.rules.push(
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: path.join(__dirname, "..", ".babel-cache", "story-tests-js"),
                },
                exclude: /(node_modules)|(WebWorms)/,
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                query: {
                    cacheDirectory: path.join(__dirname, "..", ".babel-cache", "story-tests-js-webworms"),
                    presets: [require.resolve("@babel/preset-env"), require.resolve("@babel/preset-react")],
                },
                include: /WebWorms/,
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: path.resolve(__dirname, "..", ".babel-cache", "story-tests-ts"),
                            ...babelConfig,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                exclude: /node_modules/,
                loaders: [
                    "classnames-loader",
                    "style-loader",
                    "css-loader?localIdentName=[name]-[local]-[hash:base64:4]",
                    "less-loader",
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                exclude: /node_modules/,
                loader: "url-loader",
            },
            {
                test: /\.css$/,
                include: /react-(ui|icons)/,
                exclude: /react-ui(\\|\/)node_modules/,
                loader: "style-loader!css-loader?localIdentName=[name]-[local]-[hash:base64:4]!postcss-loader",
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                include: /react-ui/,
                exclude: /react-ui(\\|\/)node_modules/,
                loader: "url-loader",
            },
            {
                test: /\.md$/,
                loader: "raw-loader",
            }
        );
        config.resolve.modules = ["node_modules", "local_modules"];
        config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias.Domain = path.join(__dirname, "../src/Domain");
        config.resolve.alias.Commons = path.join(__dirname, "../src/Commons");
        config.resolve.alias.assets = path.join(__dirname, "../assets");
        config.resolve.alias["mocha-typescript"] = path.join(
            __dirname,
            "../src/Commons/MochaTypescriptStories/AliasForMochaTypeScriptForBrowser.js"
        );
        config.resolve.alias["puppeteer"] = path.join(
            __dirname,
            "../src/Commons/MochaTypescriptStories/AliasForPuppeteerForBrowser.js"
        );

        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env.enableReactTesting": JSON.stringify(true),
            }),
            new webpack.NamedModulesPlugin()
        );

        return config;
    },
};
