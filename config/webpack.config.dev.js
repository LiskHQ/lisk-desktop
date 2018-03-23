/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../app', '../dist'),
    publicPath: '/',
    filename: 'bundle.[name].js',
  },
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 8080,
    historyApiFallback: true,
    host: '0.0.0.0',
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false,
      TEST: false,
      // because of https://fb.me/react-minification
      'process.env': {
        NODE_ENV: null,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new BaseHrefWebpackPlugin({ baseHref: '/hub' }),
  ],
});
