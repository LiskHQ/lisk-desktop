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
  clickOnOptionInList,
} = require('../support/util.js');
const accounts = require('../../constants/accounts.js');

chai.use(chaiAsPromised);
const { expect } = chai;
const EC = protractor.ExpectedConditions;
const defaultTimeout = 10 * 1000;

defineSupportCode(({
  Given, When, Then, setDefaultTimeout,
}) => {
  setDefaultTimeout(defaultTimeout);

  When('I fill in "{value}" to "{fieldName}" field', (value, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, value, callback);
  });

  When('I fill in second passphrase of "{accountName}" to "{fieldName}" field', (accountName, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    const { secondPassphrase } = accounts[accountName];
    browser.sleep(500);
    waitForElemAndSendKeys(`${selectorClass} input, ${selectorClass} textarea`, secondPassphrase, callback);
  });

  When('I fill in passphrase of "{accountName}" to "{fieldName}" field', (accountName, fieldName, callback) => {
    const selectorClass = `.${fieldName.replace(/ /g, '-')}`;
    const { passphrase } = accounts[accountName];
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

  When('I click "{id}" menu', (id, callback) => {
    waitForElemAndClickIt(`.main-tabs #${id}`, callback);
  });

  When('I click "{elementName}" in "{menuName}" menu', (elementName, menuName, callback) => {
    waitForElemAndClickIt(`.${menuName.replace(/ /g, '-')}`);
    browser.sleep(1000);
    waitForElemAndClickIt(`.${elementName.replace(/ /g, '-')}`, callback);
  });

  When('I change the language to German', (callback) => {
    waitForElemAndClickIt('.language-switcher .circle', callback);
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

  Then('I should see {count} instances of "{elementName}"', (count, elementName, callback) => {
    browser.sleep(500);
    expect(element.all(by.css(`.${elementName.replace(/ /g, '-')}`)).count()).to.eventually.equal(parseInt(count, 10))
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

  Then('I should see "{elementName}" element', (elementName, callback) => {
    const selector = `.${elementName.replace(/ /g, '-')}`;
    waitForElem(selector).then(() => {
      expect(element.all(by.css(selector)).count()).to.eventually.equal(1)
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
    const networkIndex = browser.params.network === 'customNode' ? 3 : 2;
    browser.sleep(100);
    clickOnOptionInList(networkIndex, 'network', () => {
      waitForElemAndSendKeys('.passphrase input', passphrase, () => {
        if (browser.params.network === 'customNode') {
          waitForElemAndSendKeys('.address input', browser.params.liskCoreURL, () => {
            waitForElemAndClickIt('.login-button', callback);
          });
        } else {
          waitForElemAndClickIt('.login-button', callback);
        }
      });
    });
  });

  When('I go to "{url}"', (url, callback) => {
    browser.get(`${browser.params.baseURL}#${url}`).then(callback);
  });

  Then('I should be on url "{url}"', (expectedURL) => {
    browser.getCurrentUrl().then((url) => {
      expect(url).to.eql(`${browser.params.baseURL}/#${expectedURL}`);
    });
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
    actions.perform().then(callback());
  });

  When('I remember passphrase, click "{nextButtonSelector}", choose missing words', { timeout: 2 * defaultTimeout }, (nextButtonSelector, callback) => {
    waitForElem('.passphrase').then((textareaElem) => {
      textareaElem.getText().then((passphrase) => {
        // eslint-disable-next-line no-unused-expressions
        expect(passphrase).to.not.be.undefined;
        const passphraseWords = passphrase.split(' ');
        expect(passphraseWords.length).to.equal(12);
        waitForElemAndClickIt(`.${nextButtonSelector.replace(/ /g, '-')}`, () => {
          waitForElem('form.passphrase-holder').then(() => {
            const labels = element.all(by.css('.passphrase-holder label'));
            let checkedButtons = 0;

            for (let i = 0; i < 6; i++) {
              const label = labels.get(i);

              // eslint-disable-next-line no-loop-func
              label.getText().then((text) => {
                if (passphraseWords.includes(text)) {
                  checkedButtons++;
                  label.click().then(() => {
                    if (checkedButtons === 2) {
                      callback();
                    }
                  }).catch(callback);
                }
              });
            }
          }).catch(callback);
        });
      }).catch(callback);
    }).catch(callback);
  });

  When('I refresh the page', (callback) => {
    browser.refresh().then(callback);
  });

  When('I scroll to the bottom of "{box}"', (box) => {
    const element = box.replace(/ /g, '-');
    browser.executeScript(`document.getElementsByClassName('${element}')[0].scrollTop = 10000;`);
  });

  Then('I should be logged in', (callback) => {
    const selector = '.account';
    waitForElem(selector).then(() => {
      expect(element.all(by.css(selector)).count()).to.eventually.equal(1)
        .and.notify(callback);
    }).catch(callback);
  });

  Then('I should be logged in as "{accountName}" account', (accountName, callback) => {
    waitForElemAndCheckItsText('.account-information-address', accounts[accountName].address, callback);
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

  When('I swipe "{elementName}" to right', (elementName, callback) => {
    const actions = browser.actions();
    const selector = `.${elementName.replace(/ /g, '-')}`;

    actions
      .mouseDown(element(by.css(selector)))
      .mouseMove({ x: 100, y: 0 })
      .mouseUp()
      .perform()
      .then(callback());
  });

  Then('I click {index} item in setting carousel', (index, callback) => {
    browser.sleep(500);
    const optionElem = element.all(by.css('#carouselNav li')).get(index - 1);
    browser.wait(EC.presenceOf(optionElem), waitTime)
      .catch(error => console.error(`${error}`)); // eslint-disable-line no-console
    optionElem.click().then(callback).catch(callback);
  });

  Then('I click on "{className}" element no. {index}', (className, index, callback) => {
    browser.sleep(500);
    const selector = `.${className.replace(/ /g, '-')}`;
    const optionElem = element.all(by.css(selector)).get(index - 1);
    browser.wait(EC.presenceOf(optionElem), waitTime)
      .then(() => optionElem.click().then(callback).catch(callback))
      .catch(error => console.error(`${error}`)); // eslint-disable-line no-console
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
});

