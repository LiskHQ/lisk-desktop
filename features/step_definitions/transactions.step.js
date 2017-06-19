const { defineSupportCode } = require('cucumber');
const { waitForElemAndClickIt } = require('../support/util.js');


defineSupportCode(({ When }) => {
  When('I click "{elementName}" element on table row no. {index}', (elementName, index, callback) => {
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndClickIt(`transactions tr:nth-child(${index}) ${selectorClass}`, callback);
  });
});

