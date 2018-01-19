/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiString = require('chai-string');

chai.use(chaiString);
chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const waitTime = 5000;
const emptyFn = () => {};

function waitForElem(selector) {
  return new Promise((resolve, reject) => {
    const elem = element(by.css(selector));
    const stepName = `waiting for element '${selector}'`;
    browser.wait(EC.presenceOf(elem), waitTime, stepName)
      .then(() => resolve(elem))
      .catch(reject);
  });
}

function waitForElemAndCheckItsText(selector, text, callback = emptyFn) {
  waitForElem(selector).then((elem) => {
    expect(elem.getText()).to.eventually.equalIgnoreCase(text.toLowerCase(), `inside element "${selector}"`)
      .and.notify(callback);
  }).catch(callback);
}

function waitForElemAndMatchItsText(selector, text, callback = emptyFn) {
  waitForElem(selector).then((elem) => {
    expect(elem.getText()).to.eventually.match(new RegExp(text), `inside element "${selector}"`)
      .and.notify(callback);
  }).catch(callback);
}

function waitForElemRemoved(selector) {
  return new Promise((resolve, reject) => {
    const elem = element(by.css(selector));
    const stepName = `waiting for element '${selector}' not present`;
    browser.wait(EC.not(EC.presenceOf(elem)), waitTime, stepName)
      .then(() => resolve(elem))
      .catch(reject);
  });
}

function waitForElemAndClickIt(selector, callback = emptyFn) {
  waitForElem(selector).then((elem) => {
    elem.click().then(callback).catch(callback);
  }).catch(callback);
}

function waitForElemAndSendKeys(selector, keys, callback = emptyFn) {
  waitForElem(selector).then((elem) => {
    elem.sendKeys(keys).then(callback).catch(callback);
  }).catch(callback);
}

function checkAlertDialog(title, text, callback = emptyFn) {
  waitForElemAndCheckItsText('.modal-dialog h1', title);
  waitForElemAndCheckItsText('.modal-dialog .alert-dialog-message', text, callback);
}

function clickOnOptionInList(index, selectName, callback) {
  waitForElemAndClickIt(`.${selectName}`);
  browser.sleep(1000);
  const selector = `.${selectName} ul li`;
  // const optionElem = element.all(by.css(selector)).get(index - 1);
  element.all(by.css(selector)).then((children) => {
    children[index - 1].click().then(callback).catch(callback);
  });
}

module.exports = {
  waitForElemAndCheckItsText,
  waitForElemAndMatchItsText,
  waitForElemRemoved,
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
  checkAlertDialog,
  waitTime,
  waitForElem,
  clickOnOptionInList,
};
