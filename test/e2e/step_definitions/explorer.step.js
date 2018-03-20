/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see ID "{text}" in transaction header', (text, callback) => {
    const selectorClass = '.transaction-id .copy-title';
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });
});

