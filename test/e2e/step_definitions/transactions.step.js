/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;


defineSupportCode(({ Then }) => {
  Then('I should see {lineCount} rows', (lineCount, callback) => {
    browser.sleep(500);
    expect(element.all(by.css('.transactionsRow')).count()).to.eventually.equal(parseInt(lineCount, 10))
      .and.notify(callback);
  });
});
