/* eslint-disable import/no-extraneous-dependencies */
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
    filename: 'bundle.[name].[contenthash].js',
  },
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ test: /\.js(\?.*)?$/i })],
    runtimeChunk: 'single', // enable "runtime" chunk
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!jspdf)[a-zA-Z0-9-._]+[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new NamedModulesPlugin(),
  ],
});
