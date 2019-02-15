/* eslint-disable import/no-extraneous-dependencies */
const FileChanger = require('webpack-file-changer');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const webpackBase = require('./webpack.config.base');

module.exports = merge(webpackBase, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].[hash].js',
  },

  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: true,
      TEST: false,
    }),

    new MiniCssExtractPlugin({
      allChunks: true,
      filename: 'styles.[hash].css',
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

    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),

      // new OptimizeCSSAssetsPlugin({}),
    ],
  },
});
