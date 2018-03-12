/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { NamedModulesPlugin } = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FileChanger = require('webpack-file-changer');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../app', '../app/build'),
    filename: 'bundle.[name].[hash].js',
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
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
    }),
    new NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new ExtractTextPlugin({
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
});
