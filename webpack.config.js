const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const reactToolboxVariables = {
  'color-primary': '#0288D1',
  'color-primary-dark': '#0288D1',
};

let entries = {
  app: `${path.resolve(__dirname, 'src')}/main.js`,
  vendor: ['react', 'redux', 'react-dom'],
};
const external = {
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
};
module.exports = (env) => {
  entries = env.test ? `${path.resolve(__dirname, 'src')}/main.js` : entries;
  return {
    entry: entries,
    node: {
      fs: 'empty',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: env.test ? 'bundle.js' : 'bundle.[name].js',
    },
    devServer: {
      contentBase: 'src',
      inline: true,
      port: 8080,
      historyApiFallback: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: env.prod,
        TEST: env.test,
      }),
      env.prod
        ? new webpack.optimize.UglifyJsPlugin({
          sourceMap: false,
          mangle: false,
        })
        : undefined,
      env.analyze ? new BundleAnalyzerPlugin() : undefined,
      env.test
        ? undefined
        : new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
        }),
    ].filter(p => !!p),
    externals: env.test ? external : {},
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],
            plugins: ['syntax-trailing-function-commas'],
            env: {
              test: {
                plugins: ['istanbul'],
              },
            },
          },
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url-loader',
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                sourceMap: !env.prod,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !env.prod,
                sourceComments: !env.prod,
                /* eslint-disable global-require */
                plugins: [
                  require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables,
                      },
                    },
                    plugins: [require('stylelint')({ /* your options */ })],
                  }),
                  require('postcss-partial-import')({ /* options */ }),
                  require('postcss-reporter')({ clearMessages: true }),
                ],
                /* eslint-enable */
              },
            },
          ],
        },
        {
          test: /\.json$/,
          use: ['json-loader'],
        },
      ],
    },
  };
};
