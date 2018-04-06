/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.[name].js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: false,
      // because of https://fb.me/react-minification
      'process.env': {
        NODE_ENV: null,
      },
    }),
  ],
});
