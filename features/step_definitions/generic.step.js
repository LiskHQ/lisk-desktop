/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  waitForElemAndCheckItsText,
  waitForElemRemoved,
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
  checkAlertDialog,
  waitTime,
} = require('../support/util.js');
const accounts = require('../support/accounts.js');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;

defineSupportCode(({ Given, When, Then, setDefaultTimeout }) => {
  setDefaultTimeout(20 * 1000);

  When('I fill in "{value}" to "{fieldName}" field', (value, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, value, callback);
  });

  When('I fill in second passphrase of "{accountName}" to "{fieldName}" field', (accountName, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    const secondPassphrase = accounts[accountName].secondPassphrase;
    browser.sleep(500);
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, secondPassphrase, callback);
  });


  Then('I should see "{value}" in "{fieldName}" field', (value, fieldName, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')} input, .${fieldName.replace(/ /g, '-')} textarea`));
    expect(elem.getAttribute('value')).to.eventually.equal(value)
      .and.notify(callback);
  });

  When('I click "{elementName}"', (elementName, callback) => {
    const selector = `.${elementName.replace(/\s+/g, '-')}`;
    waitForElemAndClickIt(selector, callback);
  });

  When('I click tab number {index}', (index, callback) => {
    waitForElemAndClickIt(`.main-tabs *:nth-child(${index})`, callback);
  });

  When('I click "{elementName}" in "{menuName}" menu', (elementName, menuName, callback) => {
    waitForElemAndClickIt(`.${menuName.replace(/ /g, '-')}`);
    browser.sleep(1000);
    waitForElemAndClickIt(`.${elementName.replace(/ /g, '-')}`, callback);
  });

  When('I select option no. {index} from "{selectName}" select', (index, selectName, callback) => {
    waitForElemAndClickIt(`.${selectName}`);
    browser.sleep(500);
    const optionElem = element.all(by.css(`.${selectName} ul li`)).get(index - 1);
    browser.wait(EC.presenceOf(optionElem), waitTime);
    optionElem.click().then(callback);
  });

  Then('the option "{optionText}" is selected in "{selectName}" select', (optionText, selectName, callback) => {
    const elem = element(by.css(`.${selectName} input`));
    expect(elem.getAttribute('value')).to.eventually.equal(optionText)
      .and.notify(callback);
  });

  Then('I should see alert dialog with title "{title}" and text "{text}"', (title, text, callback) => {
    checkAlertDialog(title, text, callback);
  });

  Then('I should see table with {lineCount} lines', (lineCount, callback) => {
    browser.sleep(500);
    expect(element.all(by.css('table tbody tr')).count()).to.eventually.equal(parseInt(lineCount, 10))
      .and.notify(callback);
  });

  Then('I should see no "{elementName}"', (elementName, callback) => {
    const selector = `.${elementName.replace(/ /g, '-')}`;
    waitForElemRemoved(selector, () => {
      expect(element.all(by.css(selector)).count()).to.eventually.equal(0)
        .and.notify(callback);
    });
  });

  Then('I should see "{text}" error message', (text, callback) => {
    browser.sleep(500);
    waitForElemAndCheckItsText('.error-message, .theme__error___2k5Jz', text, callback);
  });

  Then('"{elementName}" should be disabled', (elementName, callback) => {
    expect(element(by.css(`.${elementName.replace(/ /g, '-')}`)).getAttribute('disabled'))
      .to.eventually.equal('true')
      .and.notify(callback);
  });

  Then('I should see text "{text}" in "{fieldName}" element', (text, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });

  Given('I\'m logged in as "{accountName}"', (accountName, callback) => {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(1000, 1000);
    browser.get('http://localhost:8080/');
    browser.manage().addCookie({ name: 'address', value: 'http://localhost:4000' });
    browser.manage().addCookie({ name: 'network', value: '2' });
    browser.get('http://localhost:8080/');
    waitForElemAndSendKeys('.passphrase input', accounts[accountName].passphrase);
    waitForElemAndClickIt('.login-button', callback);
  });

  When('I {iterations} times move mouse randomly', (iterations, callback) => {
    const actions = browser.actions();
    /**
     * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
     * the movement of mouse to produce a pass phrase.
     */
    for (let i = 0; i < iterations; i += 1) {
      actions.mouseMove(element(by.css('body')), {
        x: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
        y: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      });
    }
    actions.perform();
    callback();
  });

  When('I remember passphrase, click "{nextButtonSelector}", fill in missing word', (nextButtonSelector, callback) => {
    waitForElemAndCheckItsText('.passphrase label', 'Save your passphrase in a safe place!');

    element(by.css('.passphrase textarea')).getText().then((passphrase) => {
      // eslint-disable-next-line no-unused-expressions
      expect(passphrase).to.not.be.undefined;
      const passphraseWords = passphrase.split(' ');
      expect(passphraseWords.length).to.equal(12);
      waitForElemAndClickIt(`.${nextButtonSelector.replace(/ /g, '-')}`);

      element.all(by.css('.passphrase-verifier p span')).get(0).getText().then((firstPartOfPassphrase) => {
        const missingWordIndex = firstPartOfPassphrase.length ?
          firstPartOfPassphrase.split(' ').length :
          0;
        element(by.css('.passphrase-verifier input')).sendKeys(passphraseWords[missingWordIndex]).then(callback);
      });
    });
  });
});

