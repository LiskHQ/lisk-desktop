/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const baseConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    main: `${resolve(__dirname, '../app/src')}/main.js`,
  },
  output: {
    path: resolve(__dirname, '../app/build'),
    filename: 'main.js',
  },
  target: 'electron-renderer',
  node: {
    __dirname: false,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'dialog.css',
      allChunks: false,
    }),
    new HtmlWebpackPlugin({
      template: './app/src/update.html',
      inject: false,
      filename: 'update.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /styles\.dialog\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
              import: true,
            },
          },
        ],
      },
    ],
  },
});
