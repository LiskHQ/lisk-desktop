/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');

defineSupportCode(({ Given, Then }) => {
  Given('I\'m on login page', (callback) => {
    browser.get(browser.params.baseURL).then(callback);
  });

  Then('I should be logged in', (callback) => {
    waitForElemAndCheckItsText('.logout-button', 'LOGOUT', callback);
  });
});

