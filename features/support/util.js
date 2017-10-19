/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const waitTime = 5000;

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function takeScreenshot(screnarioSlug, callback) {
  browser.takeScreenshot().then((screenshotBuffer) => {
    if (!fs.existsSync(browser.params.screenshotFolder)) {
      fs.mkdirSync(browser.params.screenshotFolder);
    }
    const screenshotPath = `${browser.params.screenshotFolder}/${screnarioSlug}.png`;
    writeScreenShot(screenshotBuffer, screenshotPath);
    console.log(`Screenshot saved to ${screenshotPath}`); // eslint-disable-line no-console
    if (callback) {
      callback();
    }
  });
}

function waitForElem(selector, callback) {
  const elem = element(by.css(selector));
  const stepName = `waiting for element '${selector}'`;
  browser.wait(EC.presenceOf(elem), waitTime, stepName)
    .then(() => { if (callback) { callback(elem); } })
    // catch to prevent whole test suite to fail - current scenario will timeout
    .catch(error => console.error(`${error}`)); // eslint-disable-line no-console
}

function waitForElemAndCheckItsText(selector, text, callback) {
  waitForElem(selector, (elem) => {
    expect(elem.getText()).to.eventually.equal(text, `inside element "${selector}"`)
      .and.notify(callback || (() => {}));
  });
}

function waitForElemRemoved(selector, callback) {
  const elem = element(by.css(selector));
  const stepName = `waiting for element '${selector}' not present`;
  browser.wait(EC.not(EC.presenceOf(elem)), waitTime, stepName)
    .then(callback || (() => {}))
    // catch to prevent whole test suite to fail - current scenario will timeout
    .catch(error => console.error(`${error}`)); // eslint-disable-line no-console
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
  slugify,
  waitForElem,
};
