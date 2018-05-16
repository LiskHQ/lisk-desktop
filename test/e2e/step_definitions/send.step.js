/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndMatchItsText } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see "{elementName}" element with text matching coverter price', (elementName, callback) => {
    const regexp = /^~ \d{1,100}(\.\d{1,2})?$/;
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndMatchItsText(selectorClass, regexp, callback);
  });
});
