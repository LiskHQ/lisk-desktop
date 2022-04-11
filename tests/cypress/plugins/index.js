// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const webpack = require('@cypress/webpack-preprocessor')
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = (on) => {
  const options = {
    webpackOptions: require('../../../setup/config/webpack.config.js'),
    watchOptions: {},
  };

  on('file:preprocessor', webpack(options));
  on('file:preprocessor', cucumber());

  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
  });

  require('cypress-terminal-report/src/installLogsPrinter')(on, { includeSuccessfulHookLogs: true });
};
