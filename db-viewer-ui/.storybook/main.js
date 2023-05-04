const path = require("path");
const fs = require("fs");

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../.babelrc")));

module.exports = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: ["@storybook/addon-actions", "storybook-addon-react-router-v6"],
    core: { builder: "webpack5" },
    webpackFinal: config => {
        config.module.rules = [
            {
                test: /\.[jt]sx?$/,
                use: {
                    loader: require.resolve("babel-loader"),
                    options: babelConfig,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
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
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|gif|png)$/,
                loader: require.resolve("url-loader"),
            },
        ];

        config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx"];

        return config;
    },
};
