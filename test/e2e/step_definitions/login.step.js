/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given }) => {
  Given('I\'m on login page', (callback) => {
    browser.get(browser.params.baseURL).then(callback);
  });
});

