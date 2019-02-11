/* eslint-disable import/no-extraneous-dependencies */
// const reactToolboxVariables = require('./reactToolbox.config');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const { resolve } = require('path');
const bundleVersion = require('../package.json').version;
const fs = require('fs');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nScannerPlugin = require('../src/i18n-scanner');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const getLocales = (url) => {
  const file = fs.readFileSync(path.join(__dirname, url));
  const str = [];
  const langs = file.toString().match(/.*:\s{\r?\n/g);
  langs.forEach((item) => {
    str.push(item.match(/[a-z]{2}/g)[0]);
  });
  return str.join('|');
};

const langRegex = getLocales('../i18n/languages.js');

const entries = {
  app: `${resolve(__dirname, '../src')}/main.js`,
  vendor: ['@babel/polyfill', 'url-polyfill', 'react', 'redux', 'react-dom', 'react-redux'],
  'head.css': `${resolve(__dirname, '../src/assets/css')}/styles.head.css`,
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
    new DefinePlugin({
      VERSION: `"${bundleVersion}"`,
    }),
    new StyleLintPlugin({
      context: `${resolve(__dirname, '../src')}/`,
      files: '**/*.css',
      config: {
        extends: 'stylelint-config-standard',
        rules: {
          'selector-pseudo-class-no-unknown': null,
          'unit-whitelist': ['px', 'deg', '%', 'ms', 's'],
          'length-zero-no-unit': null,
          'at-rule-no-unknown': null,
          'selector-no-vendor-prefix': true,
          'no-descending-specificity': null,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      allChunks: true,
      id: 2,
      chunkFilename: 'styles.css',
    }),
    new MiniCssExtractPlugin({
      filename: 'head.css',
      allChunks: false,
      id: 1,
      chunkFilename: 'head.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      VERSION: bundleVersion,
      inject: true,
      inlineSource: '.(css)$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new I18nScannerPlugin({
      translationFunctionNames: ['i18next.t', 'props.t', 'this.props.t', 't'],
      outputFilePath: './i18n/locales/en/common.json',
      files: [
        './src/**/*.js',
        './app/src/**/*.js',
      ],
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(langRegex)),
  ],
  module: {
    rules: [
      {
        test: /styles\.head\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: false,
            },
          },
        ],
      },
      {
        test: /^((?!styles\.head).)*\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss-loader',
              sourceMap: true,
              sourceComments: true,
              plugins: [
                require('postcss-partial-import')({}),
                require('postcss-mixins')({}),
                require('postcss-nesting')({}),
                require('postcss-preset-env')({}),
                // require('postcss-cssnext')({
                //   features: {
                //     customProperties: {
                //       variables: reactToolboxVariables,
                //     },
                //   },
                // }),
                require('postcss-functions')({
                  functions: {
                    rem: px => `${(px / 10)}rem`,
                  },
                }),
                require('postcss-for')({}),
              ],
            },
          },
        ],
      },
    ],
  },
};
