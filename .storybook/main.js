const { resolve } = require('path');

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
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links'
  ],
  core: {
    builder: 'webpack5',
  },
};
