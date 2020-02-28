const createWebpackConfig = require("./createWebpackConfig");

module.exports = function(env) {
    return createWebpackConfig(__dirname, env);
};
