const { resolve } = require('path');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');

module.exports = merge(baseConfig, reactConfig, {
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.[name].js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
