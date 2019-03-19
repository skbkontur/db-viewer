module.exports = (config, env) => {
  config.module.rules = [];
  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.(c|le)ss$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {importLoaders: 1, localIdentName: '[name]__[local]--[hash:base64:5]'}
      }, {
        loader: 'less-loader',
      }]
    },
    {
      test: /\.(png|woff|woff2|eot)$/,
      loader: 'url-loader',
    });

  config.resolve.modules = [
    'web_modules',
    'node_modules',
    'local_modules',
  ];
  config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".less", ".css"];


  return config;
};
