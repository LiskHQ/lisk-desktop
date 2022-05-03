const { resolve } = require('path');
const { ContextReplacementPlugin, DefinePlugin, ProvidePlugin } = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');
const fs = require('fs');
const path = require('path');
const reactToolboxVariables = require('./reactToolbox.config');
const I18nScannerPlugin = require('../../scripts/i18n/i18n-scanner');
const bundleVersion = require('../../package.json').version;
const stylelintrc = require('../.stylelintrc.json');

const getLocales = (url) => {
  const file = fs.readFileSync(path.join(__dirname, url));
  const str = [];
  const langs = file.toString().match(/.*:\s{\r?\n/g);
  langs.forEach((item) => {
    str.push(item.match(/[a-z]{2}/g)[0]);
  });
  return str.join('|');
};

const langRegex = getLocales('../../src/utils/i18n/languages.js');

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    modules: {
      mode: 'local',
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  },
};

const headCssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    modules: false,
  },
};

const MiniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader,
};

const reactToastifyLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    modules: {
      mode: 'local',
      localIdentName: '[local]',
    },
  },
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    sourceComments: true,
    plugins: [
      require('postcss-partial-import')({}),
      require('postcss-mixins')({}),
      require('postcss-nesting')({}),
      require('postcss-preset-env')({
        stage: 0,
        features: {
          'custom-properties': {
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
    ],
  },
};

const config = {
  mode: 'development',
  entry: {
    app: `${resolve(__dirname, '../react')}/main.js`,
    head: `${resolve(__dirname, '../react/assets/css')}/styles.head.css`,
  },
  devtool: 'source-map',
  devServer: {
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new DefinePlugin({
      VERSION: `"${bundleVersion}"`,
    }),
    new StyleLintPlugin({
      context: `${resolve(__dirname, '../../packages')}`,
      files: '**/*.css',
      config: stylelintrc,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: `${resolve(__dirname, '../react/index.html')}`,
      VERSION: bundleVersion,
      inject: false,
      excludeChunks: ['head'],
      templateParameters: {
        style: 'styles.[contenthash].css',
        bundle: 'bundle.vendor.[contenthash].js',
        app: 'bundle.app.[contenthash].js',
      },
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime/]),
    new I18nScannerPlugin({
      translationFunctionNames: ['i18next.t', 'props.t', 'this.props.t', 't'],
      outputFilePath: 'src/locales/en/common.json',
      files: [
        './setup/i18n/**/*.js',
        './packages/**/*.js',
        './app/src/**/*.js',
      ],
    }),
    new ContextReplacementPlugin(/moment[/\\]locale$/, new RegExp(langRegex)),
  ],
  module: {
    rules: [
      {
        test: /styles\.head\.css$/,
        use: [MiniCssExtractPluginLoader, headCssLoader],
      },
      {
        test: /ReactToastify\.css$/,
        use: [MiniCssExtractPluginLoader, reactToastifyLoader, postCssLoader],
      },
      {
        test: /^((?!(styles\.head|ReactToastify)).)*\.css$/,
        use: [MiniCssExtractPluginLoader, cssLoader, postCssLoader],
      },
    ],
  },
};

module.exports = config;
