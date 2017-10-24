/* eslint-disable */
const path = require('path');
const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { NamedModulesPlugin } = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const reactToolboxVariables = require('./reactToolbox.config');
/* eslint-enable */

const entries = `${path.resolve(__dirname, '../src')}/main.js`;
const externals = {
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
};
module.exports = merge(baseConfig, reactConfig, {
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false,
      TEST: true,
      // because of https://fb.me/react-minification
      'process.env': {
        NODE_ENV: null,
      },
    }),
  ],
  externals,
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
                sourceMap: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                sourceComments: true,
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
