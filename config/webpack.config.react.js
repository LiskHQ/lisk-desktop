/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const I18nScannerPlugin = require('../src/i18n-scanner');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

const entries = {
  app: `${resolve(__dirname, '../src')}/main.js`,
  vendor: ['react', 'redux', 'react-dom'],
};

module.exports = {
  entry: entries,
  devtool: 'source-map',
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new StyleLintPlugin({
      context: `${resolve(__dirname, '../src')}/`,
      files: '**/*.css',
      config: {
        extends: 'stylelint-config-standard',
        rules: {
          'selector-pseudo-class-no-unknown': null,
          'unit-whitelist': ['px', 'deg', '%', 'em', 'ms'],
          'length-zero-no-unit': null,
        },
        ignoreFiles: './node_modules/**/*.css',
      },
    }),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,
    }),
    new I18nScannerPlugin({
      translationFunctionNames: ['i18next.t', 'props.t', 'this.props.t', 't'],
      outputFilePath: './i18n/locales/en/common.json',
      files: [
        './src/**/*.js',
        './app/src/**/*.js',
      ],
    }),
    new HardSourceWebpackPlugin(),
  ],
};
