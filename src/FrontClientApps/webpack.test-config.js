const nodeExternals = require("webpack-node-externals");
const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, "babel.config.json")));

module.exports = ((dir, argv, options) => {
    const opts = Object.assign(
        {
            plugins: [],
            hashNames: false,
        },
        options || {}
    );

    const config = {
        devtool: "#inline-cheap-module-source-map",
        output: {
            devtoolModuleFilenameTemplate: "[absolute-resource-path]",
            devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]",
        },
        module: {
            rules: [
                {
                    test: [/\.jsx?$/, /\.tsx?$/],
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: path.join(__dirname, ".babel-cache", "unit-tests"),
                            ...babelConfig,
                        },
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /\.(c|le)ss$/,
                    use: ["classnames-loader", "null-loader"],
                },
                {
                    test: /\.(woff|woff2|eot|svg|ttf|gif|png)$/,
                    use: "file-loader",
                },
            ],
        },
        resolve: {
            modules: ["node_modules", "local_modules", "web_modules"],
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            alias: {
                Domain: path.join(__dirname, "src/Domain"),
                Commons: path.join(__dirname, "src/Commons"),
                assets: path.join(__dirname, "assets"),
            },
        },
        externals: [
            nodeExternals({
                whitelist: /(react-ui)|(react-ui-validations)|(react-icons)/,
            }),
        ],
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": '"test"',
            }),
        ],
        mode: "development",
    };
    return config;
})(__dirname, process.argv);
