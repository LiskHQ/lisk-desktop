/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndMatchItsText } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see "{elementName}" element with text matching validator format', (elementName, callback) => {
    const regexp = /^~ \d{0,100}(\.\d{0,2}){0,1}$/;
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndMatchItsText(selectorClass, regexp, callback);
  });
});

