const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { waitForElemAndClickIt } = require('../support/util.js');

chai.use(chaiAsPromised);
const expect = chai.expect;

defineSupportCode(({ When, Then }) => {
  When('I click "{itemSelector}" in main menu', (itemSelector, callback) => {
    waitForElemAndClickIt('header .md-icon-button');
    browser.sleep(1000);
    waitForElemAndClickIt(`md-menu-item .md-button.${itemSelector.replace(/ /g, '-')}`, callback);
  });

  Then('There is no "{itemSelector}" in main menu', (itemSelector, callback) => {
    waitForElemAndClickIt('header .md-icon-button');
    browser.sleep(1000);
    expect(element.all(by.css(`md-menu-item .md-button.${itemSelector.replace(/ /g, '-')}`)).count()).to.eventually.equal(0)
      .and.notify(callback);
  });

  Then('I should see in "{fieldName}" field:', (fieldName, value, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')}`));
    expect(elem.getAttribute('value')).to.eventually.equal(value)
      .and.notify(callback);
  });
});
