/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const waitTime = 4000;

function waitForElemAndCheckItsText(selector, text, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`);
  expect(elem.getText()).to.eventually.equal(text, `inside element "${selector}"`)
    .and.notify(callback || (() => {}));
}

function waitForElemRemoved(selector, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.not(EC.presenceOf(elem)), waitTime,
    `waiting for element '${selector}' not present`).then(callback || (() => {}));
}

function waitForElemAndClickIt(selector, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`);
  elem.click().then(() => {
    if (callback) callback();
  });
}

function waitForElemAndSendKeys(selector, keys, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`);
  elem.sendKeys(keys).then(() => {
    if (callback) callback();
  });
}

function checkAlertDialog(title, text, callback) {
  waitForElemAndCheckItsText('.modal-dialog h1', title);
  waitForElemAndCheckItsText('.modal-dialog .modal-dialog-body', text, () => {
    if (callback) callback();
  });
}

module.exports = {
  waitForElemAndCheckItsText,
  waitForElemRemoved,
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
  checkAlertDialog,
  waitTime,
};
