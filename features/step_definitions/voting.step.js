const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { waitForElemAndClickIt } = require('../support/util.js');

chai.use(chaiAsPromised);
const expect = chai.expect;

defineSupportCode(({ When, Then }) => {
  When('I click checkbox on table row no. {index}', (index, callback) => {
    waitForElemAndClickIt(`delegates tr:nth-child(${index}) md-checkbox`, callback);
  });

  When('Search twice for "{searchTerm}" in vote dialog', (searchTerm, callback) => {
    element.all(by.css('md-autocomplete-wrap input')).get(0).sendKeys(searchTerm);
    waitForElemAndClickIt('ul.md-autocomplete-suggestions li:nth-child(1) md-autocomplete-parent-scope');
    element.all(by.css('md-autocomplete-wrap input')).get(0).sendKeys(searchTerm);
    waitForElemAndClickIt('ul.md-autocomplete-suggestions li:nth-child(1) md-autocomplete-parent-scope', callback);
  });

  Then('I should see delegates list with {count} lines', (count, callback) => {
    expect(element.all(by.css('md-menu-item.vote-list-item')).count())
      .to.eventually.equal(parseInt(count, 10))
      .and.notify(callback);
  });
});
