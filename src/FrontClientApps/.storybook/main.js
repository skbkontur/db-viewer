const path = require("path");
const fs = require("fs");
const webpack = require("@storybook/core/node_modules/webpack");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../babel.config.json")));

module.exports = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-actions/register", "@storybook/addon-knobs/register"],
    webpackFinal: async (config, { configType }) => {
        config.entry.unshift(
            require.resolve("../react-selenium-testing-config.js"),
            require.resolve("../../../Assemblies/SeleniumTesting/react-selenium-testing.js")
        );
        config.module.rules = [];
        config.module.rules.push(
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: path.join(__dirname, "..", ".babel-cache", "storybook"),
                        ...babelConfig,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                exclude: /certificates-list/,
                loaders: [
                    "classnames-loader",
                    "style-loader",
                    "css-loader?localIdentName=[name]-[local]-[hash:base64:4]",
                    "less-loader",
                ],
            },

            {
                test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                loader: "url-loader",
            },
            {
                test: /\.md$/,
                loader: "raw-loader",
            },
            {
                test: /\.html$/,
                loader: "html-loader",
            },
            {
                test: /\.(css)$/,
                use: ["style-loader", { loader: "css-loader", options: { modules: true } }],
                include: /certificates-list/,
            }
        );

        config.resolve.modules = ["node_modules", "local_modules"];
        config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias.Domain = path.join(__dirname, "../src/Domain");
        config.resolve.alias.Commons = path.join(__dirname, "../src/Commons");
        config.resolve.alias.assets = path.join(__dirname, "../assets");
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env.enableReactTesting": JSON.stringify(true),
            }),
            new webpack.NamedModulesPlugin()
        );

        return config;
    },
};
