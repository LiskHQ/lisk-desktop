/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const { ContextReplacementPlugin, DefinePlugin } = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const reactToolboxVariables = require('./reactToolbox.config');
const I18nScannerPlugin = require('../src/i18n-scanner');
const fs = require('fs');
const path = require('path');

const getLocales = (url) => {
  const file = fs.readFileSync(path.join(__dirname, url));
  const str = [];
  const langs = file.toString().match(/.*:\s{\r?\n/g);
  langs.forEach((item) => {
    str.push(item.match(/[a-z]{2}/g)[0]);
  });
  return str.join('|');
};
/* eslint-enable import/no-extraneous-dependencies */

const langRegex = getLocales('../i18n/languages.js');
const entries = {
  app: `${resolve(__dirname, '../src')}/main.js`,
  vendor: ['babel-polyfill', 'url-polyfill', 'react', 'redux', 'react-dom', 'react-redux'],
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
      DEFAULT_NEWTORK: JSON.stringify(process.env.TESTNET ? 'testnet' : 'mainnet'),
    }),
    new StyleLintPlugin({
      context: `${resolve(__dirname, '../src')}/`,
      files: '**/*.css',
      config: {
        extends: 'stylelint-config-standard',
        rules: {
          'selector-pseudo-class-no-unknown': null,
          'unit-whitelist': ['px', 'deg', '%', 'ms'],
          'length-zero-no-unit': null,
          'at-rule-no-unknown': null,
        },
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
    new ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(langRegex)),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                sourceComments: true,
                plugins: [
                  /* eslint-disable import/no-extraneous-dependencies */
                  require('postcss-partial-import')({}),
                  require('postcss-mixins')({}),
                  require('postcss-nesting')({}),
                  require('postcss-cssnext')({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables,
                      },
                    },
                  }),
                  require('postcss-functions')({
                    functions: {
                      rem: px => `${(px / 10)}rem`,
                    },
                  }),
                  require('postcss-for')({}),
                  /* eslint-enable import/no-extraneous-dependencies */
                ],
              },
            },
          ],
        })),
      },
    ],
  },
};
