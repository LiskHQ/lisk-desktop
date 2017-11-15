/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');

defineSupportCode(({ Then }) => {
  Then('I should see forging center', (callback) => {
    waitForElemAndCheckItsText('.delegate-name', 'genesis_17');
    waitForElemAndCheckItsText('.forged-blocks h5', 'Forged Blocks', callback);
  });
});
