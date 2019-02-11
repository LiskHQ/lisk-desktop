/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const baseConfig = require('./webpack.config');
const FileChanger = require('webpack-file-changer');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const reactConfig = require('./webpack.config.react');

module.exports = merge(baseConfig, reactConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].[hash].js',
  },
  plugins: [
    new DefinePlugin({
      PRODUCTION: true,
      TEST: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css',
      allChunks: true,
    }),
    new FileChanger({
      change: [
        {
          file: './index.html',
          parameters: {
            'styles\\.css': 'styles.[hash].css',
            'bundle\\.vendor\\.js': 'bundle.vendor.[hash].js',
            'bundle\\.app\\.js': 'bundle.app.[hash].js',
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
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
