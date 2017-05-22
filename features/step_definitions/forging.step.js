const { defineSupportCode } = require('cucumber');
const { waitForElemAndCheckItsText } = require('../support/util.js');


defineSupportCode(({ Then }) => {
  Then('I should see forging center', (callback) => {
    waitForElemAndCheckItsText('forging .delegate-name', 'genesis_17', callback);
    waitForElemAndCheckItsText('forging md-card.forged-blocks md-card-title .md-title', 'Forged Blocks', callback);
  });
});
