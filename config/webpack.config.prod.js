/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { NamedModulesPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const FileChanger = require('webpack-file-changer');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const bundleVersion = require('../package.json').version;
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
    new HtmlWebpackPlugin({
      template: './app/build/index.html',
      VERSION: bundleVersion,
      inject: false,
      inlineSource: '.(css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FileChanger({
      change: [
        {
            file: "./index.html",
            parameters: {
                'bundle\\.vendor\\.js': 'bundle.vendor.[hash].js',
                'bundle\\.app\\.js': 'bundle.app.[hash].js',
            },
        }  
      ]
    })
  ],
});
