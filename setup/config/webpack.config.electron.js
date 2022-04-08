const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');

const config = {
  mode: 'production',
  entry: {
    main: `${resolve(__dirname, '../../setup/react')}/main.js`,
  },
  output: {
    path: resolve(__dirname, '../../setup/react/app/build'),
    filename: '[name].js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
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
};

module.exports = merge(baseConfig, reactConfig, config);
