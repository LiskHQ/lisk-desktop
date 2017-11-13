/* eslint-disable import/no-extraneous-dependencies */
const { defineSupportCode } = require('cucumber');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  waitForElemAndCheckItsText,
  waitForElemAndMatchItsText,
  waitForElemRemoved,
  waitForElemAndClickIt,
  waitForElemAndSendKeys,
  waitForElem,
  checkAlertDialog,
  waitTime,
} = require('../support/util.js');
const accounts = require('../support/accounts.js');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const defaultTimeout = 10 * 1000;

defineSupportCode(({ Given, When, Then, setDefaultTimeout }) => {
  setDefaultTimeout(defaultTimeout);

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

  When('I fill in passphrase of "{accountName}" to "{fieldName}" field', (accountName, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    const passphrase = accounts[accountName].passphrase;
    browser.sleep(500);
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, passphrase, callback);
  });

  When('I wait {seconds} seconds', { timeout: -1 }, (seconds, callback) => {
    browser.sleep(seconds * 1000).then(callback);
  });


  Then('I should see "{value}" in "{fieldName}" field', (value, fieldName, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')} input, .${fieldName.replace(/ /g, '-')} textarea`));
    expect(elem.getAttribute('value')).to.eventually.equal(value)
      .and.notify(callback);
  });

  Then('I should see empty "{fieldName}" field', (fieldName, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')} input, .${fieldName.replace(/ /g, '-')} textarea`));
    expect(elem.getAttribute('value')).to.eventually.equal('')
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
    browser.sleep(1000);
    const selector = `.${selectName} ul li`;
    const optionElem = element.all(by.css(selector)).get(index - 1);
    browser.wait(EC.presenceOf(optionElem), waitTime)
      .catch(error => console.error(`${error}`)); // eslint-disable-line no-console
    optionElem.click().then(callback).catch(callback);
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

  Then('I should see "{elementName}" table with {lineCount} lines', (elementName, lineCount, callback) => {
    browser.sleep(500);
    expect(element.all(by.css(`table.${elementName.replace(/ /g, '-')} tbody tr`)).count()).to.eventually.equal(parseInt(lineCount, 10))
      .and.notify(callback);
  });


  Then('I should see no "{elementName}"', (elementName, callback) => {
    const selector = `.${elementName.replace(/ /g, '-')}`;
    waitForElemRemoved(selector).then(() => {
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

  Then('I should see text "{text}" in "{elementName}" element', (text, elementName, callback) => {
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });

  Then('I should see "{elementName}" element with text matching regexp:', (elementName, text, callback) => {
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndMatchItsText(selectorClass, text, callback);
  });

  Then('I should see element "{elementName}" that contains text:', (elementName, text, callback) => {
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    waitForElemAndCheckItsText(selectorClass, text, callback);
  });

  When('I clear "{elementName}" field', (elementName) => {
    const selectorClass = `.${elementName.replace(/ /g, '-')}`;
    browser.executeScript(`window.document.querySelector("${selectorClass} input, ${selectorClass} textarea").value = "";`);
  });

  Given('I\'m logged in as "{accountName}"', { timeout: 2 * defaultTimeout }, (accountName, callback) => {
    const passphrase = browser.params.useTestnetPassphrase
      ? browser.params.testnetPassphrase
      : accounts[accountName].passphrase;

    waitForElemAndSendKeys('.passphrase input', passphrase, () => {
      waitForElemAndClickIt('.login-button', callback);
    });
  });

  When('I go to "{url}"', (url, callback) => {
    browser.get(`${browser.params.baseURL}#${url}`).then(callback);
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

  When('I remember passphrase, click "{nextButtonSelector}", fill in missing word', { timeout: 2 * defaultTimeout }, (nextButtonSelector, callback) => {
    waitForElemAndCheckItsText('.passphrase label', 'Save your passphrase in a safe place!', () => {
      waitForElem('.passphrase textarea').then((textareaElem) => {
        textareaElem.getText().then((passphrase) => {
          // eslint-disable-next-line no-unused-expressions
          expect(passphrase).to.not.be.undefined;
          const passphraseWords = passphrase.split(' ');
          expect(passphraseWords.length).to.equal(12);
          waitForElemAndClickIt(`.${nextButtonSelector.replace(/ /g, '-')}`, () => {
            waitForElem('.passphrase-verifier p span').then((elem) => {
              elem.getText().then((firstPartOfPassphrase) => {
                const missingWordIndex = firstPartOfPassphrase.length ?
                  firstPartOfPassphrase.split(' ').length :
                  0;
                waitForElemAndSendKeys('.passphrase-verifier input', passphraseWords[missingWordIndex], callback);
              }).catch(callback);
            }).catch(callback);
          });
        }).catch(callback);
      }).catch(callback);
    });
  });

  When('I refresh the page', (callback) => {
    browser.refresh().then(callback);
  });

  When('I scroll to the bottom', () => {
    browser.executeScript('window.scrollBy(0, 10000);');
  });

  Then('I should be logged in', (callback) => {
    waitForElemAndCheckItsText('.logout-button', 'LOGOUT', callback);
  });

  Then('I should be logged in as "{accountName}" account', (accountName, callback) => {
    waitForElemAndCheckItsText('.full.address', accounts[accountName].address, callback);
  });

  When('I click "{itemSelector}" in main menu', (itemSelector, callback) => {
    waitForElemAndClickIt('.main-menu-icon-button');
    browser.sleep(1000);
    waitForElemAndClickIt(`.${itemSelector.replace(/ /g, '-')}`);
    browser.sleep(1000).then(callback);
  });

  Then('There is no "{itemSelector}" in main menu', (itemSelector, callback) => {
    waitForElemAndClickIt('.main-menu-icon-button');
    browser.sleep(500);
    expect(element.all(by.css(`md-menu-item .md-button.${itemSelector.replace(/ /g, '-')}`)).count()).to.eventually.equal(0)
      .and.notify(callback);
  });

  Then('I should see in "{fieldName}" field:', (fieldName, value, callback) => {
    const elem = element(by.css(`.${fieldName.replace(/ /g, '-')} textarea`));
    expect(elem.getAttribute('value')).to.eventually.equal(value)
      .and.notify(callback);
  });
});

