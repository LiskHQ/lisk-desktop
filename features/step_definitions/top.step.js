/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should be on login page', (callback) => {
    waitForElemAndCheckItsText('.login-button', 'LOGIN', callback);
  });
});
