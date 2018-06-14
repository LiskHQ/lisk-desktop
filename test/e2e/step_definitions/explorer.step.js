/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText, waitForElemAndSendKeys } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see ID "{text}" in transaction header', (text, callback) => {
    const selectorClass = '.transaction-id .copy-title';
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });

  Then('I hit "{keyCode}" key in "{element}" input', (keyCode, element, callback) => {
    const selectorClass = `.${element.replace(/ /g, '-')}`;
    waitForElemAndSendKeys(selectorClass, keyCode, callback);
  });
});

