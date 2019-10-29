/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { NamedModulesPlugin } = require('webpack');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].[hash].js',
  },
  optimization: {
    minimizer: [new TerserPlugin({ test: /\.js(\?.*)?$/i })],
    runtimeChunk: 'single', // enable "runtime" chunk
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
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
    new NamedModulesPlugin(),
  ],
});
