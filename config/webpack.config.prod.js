/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { NamedModulesPlugin } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const reactToolboxVariables = require('./reactToolbox.config');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: true,
      TEST: false,
      // because of https://fb.me/react-minification
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
    }),
    new NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: false,
                sourceComments: false,
                plugins: [
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('postcss-partial-import')({}),
                  require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables,
                      },
                    },
                  }),
                  // eslint-disable-next-line import/no-extraneous-dependencies
                  require('postcss-for')({}),
                ],
              },
            },
          ],
        })),
      },
    ],
  },
});
