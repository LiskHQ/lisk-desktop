/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const reactToolboxVariables = require('./reactToolbox.config');
const I18nScannerPlugin = require('../src/i18n-scanner');
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
