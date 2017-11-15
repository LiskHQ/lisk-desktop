/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
} = require('../support/util.js');

chai.use(chaiAsPromised);
const expect = chai.expect;

defineSupportCode(({ When, Then }) => {
  When('I click checkbox on table row no. {index}', (index, callback) => {
    waitForElemAndClickIt(`table tr:nth-child(${index}) td label`, callback);
  });

  When('Search twice for "{searchTerm}" in vote dialog', (searchTerm, callback) => {
    waitForElemAndSendKeys('.votedListSearch input', searchTerm, () => {
      waitForElemAndClickIt('#votedResult ul li:nth-child(1)', () => {
        element.all(by.css('.votedListSearch input')).get(0).sendKeys(searchTerm);
        browser.sleep(500);
        waitForElemAndClickIt('#votedResult ul li:nth-child(1)', callback);
      });
    });
  });

  Then('I should see delegates list with {count} lines', (count, callback) => {
    expect(element.all(by.css('.my-votes-button li')).count())
      .to.eventually.equal(parseInt(count, 10))
      .and.notify(callback);
  });
});
