/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const waitTime = 10000;

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function takeScreenshot(screnarioSlug) {
  browser.takeScreenshot().then((screenshotBuffer) => {
    if (!fs.existsSync(browser.params.screenshotFolder)) {
      fs.mkdirSync(browser.params.screenshotFolder);
    }
    writeScreenShot(screenshotBuffer, `${browser.params.screenshotFolder}/${screnarioSlug}.png`);
  });
}

function waitForElem(selector, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`)
    .then(() => { if (callback) { callback(elem); } })
    .catch(() => { takeScreenshot('TIMEOUT'); });
}

function waitForElemAndCheckItsText(selector, text, callback) {
  waitForElem(selector, (elem) => {
    expect(elem.getText()).to.eventually.equal(text, `inside element "${selector}"`)
      .and.notify(callback || (() => {}));
  });
}

function waitForElemRemoved(selector, callback) {
  const elem = element(by.css(selector));
  browser.wait(EC.not(EC.presenceOf(elem)), waitTime,
    `waiting for element '${selector}' not present`).then(callback || (() => {}));
}

function waitForElemAndClickIt(selector, callback) {
  waitForElem(selector, (elem) => {
    elem.click().then(() => {
      if (callback) callback();
    });
  });
}

function waitForElemAndSendKeys(selector, keys, callback) {
  waitForElem(selector, (elem) => {
    elem.sendKeys(keys).then(() => {
      if (callback) callback();
    });
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
  takeScreenshot,
};
