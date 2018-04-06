/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
/* eslint-enable import/no-extraneous-dependencies */

const entries = `${resolve(__dirname, '../src')}/main.js`;
const externals = {
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true,
};
module.exports = merge(baseConfig, reactConfig, {
  entry: entries,
  output: {
    path: resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: false,
      TEST: true,
      // because of https://fb.me/react-minification
      'process.env': {
        NODE_ENV: null,
      },
    }),
  ],
  externals,
});

