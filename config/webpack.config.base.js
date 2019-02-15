/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nScannerPlugin = require('../src/i18n-scanner');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');

const bundleVersion = require('../package.json').version;


/* *******************************************************
 * I18N HELPER
 ******************************************************** */
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


/* *******************************************************
 * WEBPACK CONFIG
 ******************************************************** */
const webpackBase = {
  entry: {
    app: path.resolve(__dirname, '../src/main.js'),
    vendor: ['@babel/polyfill', 'url-polyfill', 'react', 'redux', 'react-dom', 'react-redux'],
    'head.css': path.resolve(__dirname, '../src/assets/css/styles.head.css'),
  },

  node: {
    fs: 'empty',
    child_process: 'empty',
  },

  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
  },

  plugins: [
    new webpack.DefinePlugin({
      VERSION: `"${bundleVersion}"`,
    }),

    new StyleLintPlugin({
      context: `${path.resolve(__dirname, '../src')}/`,
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
      allChunks: false,
      filename: 'head.css',
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      VERSION: bundleVersion,
      inject: false,
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

    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(langRegex)),
  ],

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
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
                /* eslint-disable import/no-extraneous-dependencies */
                require('postcss-partial-import')({}),
                require('postcss-mixins')({}),
                require('postcss-nesting')({}),
                require('postcss-preset-env')({}),
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
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        exclude: [/images/],
        options: {
          name: '[path][name]-[hash:6].[ext]',
        },
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: [/fonts/],
        loader: 'url-loader',
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
        },
        head: {
          name: 'head.css',
          test: /styles\.head\.css$/,
        },
        styles: {
          name: 'styles',
          test: /^((?!styles\.head).)*\.css$/,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

module.exports = webpackBase;
