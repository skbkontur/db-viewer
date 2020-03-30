const path = require("path");
const fs = require("fs");

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../.babelrc")));

module.exports = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-actions/register"],
    webpackFinal: config => {
        config.module.rules = [
            {
                test: /\.[jt]sx?$/,
                use: {
                    loader: "babel-loader",
                    options: babelConfig,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.(c|le)ss$/,
                loaders: [
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
                test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                loader: "url-loader",
            },
        ];

        config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias.Components = path.join(__dirname, "../src/Components");
        config.resolve.alias.Containers = path.join(__dirname, "../src/Containers");
        config.resolve.alias.Domain = path.join(__dirname, "../src/Domain");

        return config;
    },
};
