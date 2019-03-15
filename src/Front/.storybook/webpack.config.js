const path = require("path");
const autoprefixer = require('autoprefixer');

{
}

module.exports = (config, env) => {
  config.module.rules = [];
  config.module.rules.push(
    {
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
      query: {
        babelrc: false,
        cacheDirectory: path.join(__dirname, "..", ".babel-cache", "storybook"),
        plugins: [
          "transform-flow-comments",
          "transform-proto-to-assign"
        ],
        presets: ["es2015", "stage-0", "react"]
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
      query: {
        babelrc: false,
        cacheDirectory: path.join(__dirname, "..", ".babel-cache", "storybook"),
        plugins: [
          "transform-flow-comments",
          "transform-proto-to-assign"
        ],
        presets: ["es2015", "stage-0", "react"]
      },
      include: /(market-ui)/,
    },
    {
      test: /\.(ts|tsx)$/,
      include: /market-ui/,
      loader: 'ts-loader',
      options: { allowTsInNodeModules: true }
    },
    {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.less$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'less-loader',
      }]
    },
    {
      test: /\.css$/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
      ],
    },
    {
      test: /\.(png|woff|woff2|eot)$/,
      loader: 'file-loader',
    });

  config.resolve.modules = [
    'web_modules',
    'node_modules',
    'local_modules',
  ];
  config.resolve.extensions = [".js", ".jsx", ".ts", ".tsx", ".less", ".css"];


  return config;
};
