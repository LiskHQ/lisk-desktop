const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias['@utils'] = resolve(__dirname, '../src/utils');
    config.resolve.alias['@api'] = resolve(__dirname, '../src/utils/api/');
    config.resolve.alias['@constants'] = resolve(__dirname, '../src/constants');
    config.resolve.alias['@shared'] = resolve(__dirname, '../src/components/shared');
    config.resolve.alias['@screens'] = resolve(__dirname, '../src/components/screens');
    config.resolve.alias['@toolbox'] = resolve(__dirname, '../src/components/toolbox');
    config.resolve.alias['@actions'] = resolve(__dirname, '../src/store/actions');
    config.resolve.alias['@store'] = resolve(__dirname, '../src/store');
    config.resolve.alias['@src'] = resolve(__dirname, '../src');
    config.resolve.alias['@fixtures'] = resolve(__dirname, '../test/constants');
    return config;
  },
  stories: ['../src/components/**/*.stories.@(js)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links'
  ],
  core: {
    builder: 'webpack5',
  },
  module: {
    rules: [
      {
        test: /^((?!styles\.head).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
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
                }),
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
  }
};
