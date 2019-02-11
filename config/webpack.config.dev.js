/* eslint-disable import/no-extraneous-dependencies */
const { DefinePlugin } = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');

module.exports = merge(baseConfig, reactConfig, {
  mode: 'development',
  output: {
    path: resolve(__dirname, '../app', '../dist'),
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
    new DefinePlugin({
      PRODUCTION: false,
      TEST: false,
    }),
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
