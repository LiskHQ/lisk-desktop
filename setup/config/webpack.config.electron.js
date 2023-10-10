const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');

const config = {
  mode: 'production',
  entry: {
    main: `${resolve(__dirname, '../../app/src')}/main.js`,
  },
  output: {
    path: resolve(__dirname, `../../app/${process.env.BUILD_NAME || 'build'}`),
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
  plugins: [
    new webpack.DefinePlugin({
      LISK_ENABLE_DEV_TOOL: JSON.parse(process.env.ENABLE_DEV_TOOL || true),
    }),
  ],
};

module.exports = merge(baseConfig, config);
