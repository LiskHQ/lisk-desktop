/* eslint-disable import/no-extraneous-dependencies */
const baseConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'production',

  entry: {
    main: path.resolve(__dirname, '../app/src/main.js'),
  },

  output: {
    path: path.resolve(__dirname, '../app/build'),
    filename: 'main.js',
  },

  target: 'electron-renderer',

  externals: [nodeExternals()],

  node: {
    __dirname: false,
  },

  plugins: [
    new MiniCssExtractPlugin({
      allChunks: false,
      filename: 'dialog.css',
    }),

    new HtmlWebpackPlugin({
      filename: 'update.html',
      inject: false,
      template: './app/src/update.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /styles\.dialog\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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

  optimization: {
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
        dialog: {
          name: 'dialog.css',
          test: /styles\.dialog\.css$/,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
});
