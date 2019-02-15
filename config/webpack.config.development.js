/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

const webpackBase = require('./webpack.config.base');

module.exports = merge(webpackBase, {
  mode: 'development',

  output: {
    path: path.resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.[name].js',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: 'src',
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    port: 8080,
  },

  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false,
      TEST: false,
    }),

    new MiniCssExtractPlugin({
      allChunks: true,
      filename: 'styles.css',
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
});
