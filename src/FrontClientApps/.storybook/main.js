const path = require("path");
const fs = require("fs");
const webpack = require("@storybook/core/node_modules/webpack");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../babel.config.json")));

module.exports = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-actions/register", "@storybook/addon-knobs/register"],
    webpackFinal: async (config, { configType }) => {
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
                test: /\.html$/,
                loader: "html-loader",
            },
        );

        config.resolve.modules = ["node_modules"];
        config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias.Domain = path.join(__dirname, "../src/Domain");
        config.plugins.push(new webpack.NamedModulesPlugin());

        return config;
    },
};
