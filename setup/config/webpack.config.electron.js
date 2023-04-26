const { resolve } = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.config');

const config = {
  mode: 'production',
  entry: {
    main: `${resolve(__dirname, '../../app/src')}/main.js`,
  },
  output: {
    path: resolve(__dirname, '../../app/build'),
    filename: '[name].js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
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

module.exports = merge(baseConfig, config);
