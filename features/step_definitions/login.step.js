/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');

defineSupportCode(({ Given, Then, When }) => {
  Given('I\'m on login page', (callback) => {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(1000, 1000);
    browser.driver.get('about:blank');
    browser.get('http://localhost:8080/#/?peerStack=localhost').then(callback);
  });

  When('I refresh the page', (callback) => {
    browser.driver.navigate().refresh().then(callback);
  });

  Then('I should be logged in', (callback) => {
    waitForElemAndCheckItsText('.logout-button', 'LOGOUT', callback);
  });
});

