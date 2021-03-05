/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');

const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');

/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.[name].[contenthash].js',
  },
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 8080,
    historyApiFallback: true,
    host: '0.0.0.0',
  },
  plugins: [
    new ESLintPlugin({
      context: '../',
    }),
    new webpack.IgnorePlugin({ resourceRegExp: /\.\/locale$/ }),
  ],
});
