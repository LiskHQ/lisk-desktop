const masterAccount = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  address: '16313739661670634666L',
};

const delegateAccount = {
  passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  address: '537318935439898807L',
};

const emptyAccount = {
  passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
  address: '5932438298200837883L',
};

const EC = protractor.ExpectedConditions;
const waitTime = 5000;

function waitForElemAndCheckItsText(selector, text) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element ${selector}`);
  expect(elem.getText()).toEqual(text);
}

function checkErrorMessage(message) {
  waitForElemAndCheckItsText('send .md-input-message-animation', message);
}

function launchApp() {
  browser.ignoreSynchronization = true;
  browser.driver.manage().window().setSize(1000, 1000);
  browser.get('http://localhost:8080#?peerStack=localhost');
}

function login(account) {
  launchApp();
  element(by.css('input[type="password"]')).sendKeys(account.passphrase);
  element(by.css('.md-button.md-primary.md-raised')).click();
}

function logout() {
  const logoutButton = element(by.css('.logout'));
  browser.wait(EC.presenceOf(logoutButton), waitTime);
  logoutButton.click();
}

function send(fromAccount, toAddress, amount) {
  login(fromAccount);
  const sendElem = element(by.css('send'));
  const sendModalButton = element(by.css('md-content.header button.send'));

  browser.wait(EC.presenceOf(sendModalButton), waitTime);
  sendModalButton.click();
  browser.wait(EC.presenceOf(sendElem), waitTime);
  element(by.css('send input[name="recipient"]')).sendKeys(toAddress);
  element(by.css('send input[name="amount"]')).sendKeys(`${amount}`);
  element(by.css('send input[name="recipient"]')).click();
  const sendButton = element.all(by.css('send button.md-primary')).get(0);
  // browser.wait(EC.presenceOf(sendButton), waitTime);
  sendButton.click();
}

function checkSendConfirmation(address, amount) {
  waitForElemAndCheckItsText('md-dialog h2', 'Success');
  waitForElemAndCheckItsText('md-dialog .md-dialog-content-body', `${amount} sent to ${address}`);
  const okButton = element(by.css('md-dialog .md-button.md-ink-ripple'));
  okButton.click();
  browser.sleep(500);
}

function checkIsLoggedIn() {
  waitForElemAndCheckItsText('.logout', 'LOGOUT');
}

function testLogin() {
  login(masterAccount);
  checkIsLoggedIn();
}

function testLogout() {
  login(masterAccount);

  logout();
  waitForElemAndCheckItsText('.md-button.md-primary.md-raised', 'LOGIN');
}

function testNewAccount() {
  launchApp();

  element.all(by.css('.md-button.md-primary')).get(0).click();
  /**
   * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
   * the movement of mouse to produce a pass phrase.
   */
  for (let i = 0; i < 250; i++) {
    browser.actions()
    .mouseMove(element(by.css('body')), {
      x: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      y: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
    }).perform();
    browser.sleep(5);
  }

  waitForElemAndCheckItsText('.dialog-save h2', 'Save your passphrase in a safe place!');

  element(by.css('.dialog-save textarea.passphrase')).getText().then((passphrase) => {
    expect(passphrase).toBeDefined();
    const passphraseWords = passphrase.split(' ');
    expect(passphraseWords.length).toEqual(12);
    const nextButton = element.all(by.css('.dialog-save .md-button.md-ink-ripple')).get(1);
    nextButton.click();

    element.all(by.css('.dialog-save p.passphrase span')).get(0).getText().then((firstPartOfPassphrase) => {
      const missingWordIndex = firstPartOfPassphrase.length ?
        firstPartOfPassphrase.split(' ').length :
        0;
      element(by.css('.dialog-save input')).sendKeys(passphraseWords[missingWordIndex]);
      const okButton = element.all(by.css('.dialog-save .md-button.md-ink-ripple')).get(2);
      okButton.click();

      checkIsLoggedIn();
    });
  });
}

function testAddress() {
  login(masterAccount);
  waitForElemAndCheckItsText('.address', masterAccount.address);
}

function testPeer() {
  launchApp();
  expect(element.all(by.css('form md-input-container:first-child label')).get(0).getText()).toEqual('Choose a peer');
}

function testChangePeer() {
  launchApp();

  const peerElem = element(by.css('form md-select'));
  browser.wait(EC.presenceOf(peerElem), waitTime);
  peerElem.click();

  const optionElem = element.all(by.css('md-select-menu md-optgroup md-option')).get(0);
  browser.wait(EC.presenceOf(optionElem), waitTime);
  optionElem.click();

  waitForElemAndCheckItsText('form md-select-value .md-text', 'node01.lisk.io');
}

function testShowBalance() {
  login(masterAccount);

  const balanceElem = element(by.css('lsk.balance'));
  browser.wait(EC.presenceOf(balanceElem), waitTime);
  expect(balanceElem.getText()).toMatch(/\d+(\.\d+)? LSK/);
}

function testSend() {
  send(masterAccount, delegateAccount.address, 1.1);
  checkSendConfirmation(delegateAccount.address, 1.1);
  browser.sleep(1000);
  logout();

  send(delegateAccount, masterAccount.address, 1);
  checkSendConfirmation(masterAccount.address, 1);
}

function testSendWithNotEnoughFunds() {
  send(emptyAccount, delegateAccount.address, 10000);
  checkErrorMessage('Insufficient funds');
}

function testSendWithInvalidAddress() {
  send(masterAccount, emptyAccount.address.substr(0, 10), 1);
  checkErrorMessage('Invalid');
}

function testShowTransactions() {
  login(masterAccount);
  waitForElemAndCheckItsText('transactions .title', 'Transactions');
  expect(element.all(by.css('transactions table tbody tr')).count()).toEqual(10);
}

describe('Lisk Nano functionality', () => {
  it('should allow to login', testLogin);
  it('should allow to logout', testLogout);
  it('should show peer', testPeer);
  it('should allow to change peer', testChangePeer);
  it('should show address', testAddress);
  it('should show balance', testShowBalance);
  it('should allow to send transaction when enough funds and correct address form', testSend);
  it('should not allow to send transaction when not enough funds', testSendWithNotEnoughFunds);
  it('should not allow to send transaction when invalid address', testSendWithInvalidAddress);
  it('should show transactions', testShowTransactions);
  it('should allow to create a new account', testNewAccount);
});
