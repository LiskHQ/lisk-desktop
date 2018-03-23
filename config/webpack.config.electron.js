/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = merge(baseConfig, {
  entry: `${resolve(__dirname, '../app/src')}/main.js`,
  output: {
    path: resolve(__dirname, '../app/build'),
    filename: 'main.js',
  },
  target: 'electron-renderer',
  node: {
    __dirname: false,
  },
});
