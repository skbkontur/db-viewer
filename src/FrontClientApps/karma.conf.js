// Karma configuration
// Generated on Tue Nov 05 2019 13:01:03 GMT+0500 (RTZ 4 (зима))

var path = require("path");
var webpack = require("webpack");

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'requirejs'],
    files: [
        'configure-requirejs-for-karma.js', // note (sivukhin, 08.11.2019): Необходим для конфигурации RequireJS: https://karma-runner.github.io/4.0/plus/requirejs.html
        // note (sivukhin, 08.11.2019): Добавлением файлов ниже в страницу занимется RequireJS
        {pattern: "./react-selenium-testing-config.js", included: false},
        {pattern: "../../Assemblies/SeleniumTesting/react-selenium-testing.js", included: false},
        {pattern: 'tests-browser/**/*.test.tsx', included: false},
    ],
    preprocessors: {
        "../../Assemblies/SeleniumTesting/react-selenium-testing.js": ['webpack'],
        "**/react-selenium-testing-config.js": ['webpack'],
        'tests-browser/**/*.test.tsx': ['sourcemap', 'webpack'],
    },
    /* note (sivukhin, 08.11.2019): Из-за nodeExternals в webpack.test-config.js сборка фейлится с ошибками в духе:
        Error: Module name "react" has not been loaded yet for context: _. Use require([])
        Не разобрался почему это происходит, но оставшаяся часть конфига выглядит жизнеспособной
     */
    webpack: {
        mode: "development",
        devtool: "#inline-cheap-module-source-map",
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: ["babel-loader"],
                    exclude: /node_modules/,
                },
                {
                    test: /\.tsx?$/,
                    use: ["babel-loader"],
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
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": '"test"',
                "process.env.enableReactTesting": JSON.stringify(true),
            }),
        ],
    },
    reporters: ['progress', 'teamcity'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
