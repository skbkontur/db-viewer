const path = require("path");

module.exports = {
    entry: {
        index: ["core-js-old", "regenerator-runtime", "./src/Commons/Mutators/TestMutatorsEntryPoint.tsx"],
    },
    output: {
        path: path.join(__dirname, "test-mutators-dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: path.join(__dirname, ".babel-cache", "mutators"),
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
        extensions: [".js", ".jsx", ".tsx", ".ts"],
        alias: {
            Domain: path.join(__dirname, "src/Domain"),
            Commons: path.join(__dirname, "src/Commons"),
            assets: path.join(__dirname, "assets"),
        },
    },
    mode: "development",
};
