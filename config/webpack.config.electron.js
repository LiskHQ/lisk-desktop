/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

const extractCSS = new ExtractTextPlugin({
  filename: 'dialog.css',
  allChunks: false,
});
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    minimize: true,
    modules: false,
    import: true,
  },
};

module.exports = merge(baseConfig, {
  entry: {
    main: `${resolve(__dirname, '../app/src')}/main.js`,
  },
  output: {
    path: resolve(__dirname, '../app/build'),
    filename: 'main.js',
  },
  target: 'electron-renderer',
  node: {
    __dirname: false,
  },
  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      template: './app/src/update.html',
      inject: false,
      filename: 'update.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /styles\.dialog\.css$/,
        use: [].concat(extractCSS.extract(cssLoader)),
      },
    ],
  },
});
