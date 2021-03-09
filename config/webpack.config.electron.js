const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    main: ['babel-polyfill', `${resolve(__dirname, '../app/src')}/main.js`],
  },
  output: {
    path: resolve(__dirname, '../app/build'),
    filename: 'main.[name].js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /node_modules[/\\](iconv-lite)[/\\].+/,
        resolve: {
          aliasFields: ['main'],
        },
      },
    ],
  },
});
