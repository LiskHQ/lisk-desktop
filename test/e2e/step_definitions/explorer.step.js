/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText, waitForElem } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see ID "{text}" in transaction header', (text, callback) => {
    const selectorClass = '.transaction-id .copy-title';
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });

  Then('I hit "{key}" key in "{element}" input', (key, element, callback) => {
    const selectorClass = `.${element.replace(/ /g, '-')} input`;
    browser.sleep(500);
    waitForElem(selectorClass).then((elem) => {
      elem.sendKeys('', protractor.Key[key])
        .then(callback)
        .catch(callback);
    }).catch(callback);
  });
});
