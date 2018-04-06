/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndSendKeys } = require('../support/util.js');

defineSupportCode(({ Then, When }) => {
  let secondPass = '';
  Then('I copy the second passphrase', () => {
    const elem = element(by.css('textarea.passphrase'));
    secondPass = elem.getAttribute('value');
  });

  When('I fill in second passphrase to "{fieldName}" field', (fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    browser.sleep(500);
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, secondPass, callback);
  });
});

