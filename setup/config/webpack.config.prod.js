const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const merge = require('webpack-merge');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const version = require('../../package.json').version;

const config = {
  mode: 'production',
  output: {
    path: resolve(__dirname, '../../app/build'),
    filename: 'bundle.[name].[contenthash].js',
  },
  optimization: {
    moduleIds: 'named',
    minimizer: [new TerserPlugin({ test: /\.js(\?.*)?$/i })],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!jspdf)[a-zA-Z0-9-._]+[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify(version),
    }),
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha256'],
      enabled: true,
    }),
  ],
};

module.exports = merge(baseConfig, reactConfig, config);
