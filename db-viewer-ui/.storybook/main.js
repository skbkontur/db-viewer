const path = require("path");
const fs = require("fs");

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../.babelrc")));

module.exports = {
    stories: ["../stories/**/*.stories.tsx"],
    addons: [require.resolve("@storybook/addon-actions/register")],
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
                test: /\.(c|le)ss$/,
                loaders: [
                    require.resolve("style-loader"),
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            modules: {
                                localIdentName: "[name]-[local]-[hash:base64:4]",
                            },
                        },
                    },
                    require.resolve("less-loader"),
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
