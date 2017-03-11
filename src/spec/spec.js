var masterAccount = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  address: '16313739661670634666L',
};

var delegateAccount = {
  passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  address: '537318935439898807L',
};

var emptyAccount = {
  passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
  address: '5932438298200837883L',
};

var EC = protractor.ExpectedConditions;
var waitTime = 5000;

describe('Lisk Nano functionality', function() {
  it('should allow to login', testLogin);
  it('should allow to logout', testLogout);
  it('should show address', testAddress);
  it('should show peer', testPeer);
  it('should allow to change peer', testChangePeer);
  it('should show balance', testShowBalance);
  it('should allow to send transaction when enough funds and correct address form', testSend);
  it('should not allow to send transaction when not enough funds', testSendWithNotEnoughFunds);
  it('should not allow to send transaction when invalid address', testSendWithInvalidAddress);
  it('should show transactions', testShowTransactions);
  it('should allow to load more transactions', testLoadMoreTransactions);
  it('should allow to create a new account', testNewAccount);
});

function testLogin() {
  login(masterAccount);
  checkIsLoggedIn();
}

function checkIsLoggedIn() {
  waitForElemAndCheckItsText('.logout', 'LOGOUT');
}

function testLogout() {
  login(masterAccount);

  logout();
  waitForElemAndCheckItsText('.md-button.md-primary.md-raised', 'LOGIN');
}

function testNewAccount() {
  launchApp();

  element(by.css('.md-button.md-primary')).click();
  for (var i = 0; i < 250; i++) {
    browser.actions()
    .mouseMove(element(by.css('body')), {
      x: Math.floor(Math.random() * 1000),
      y: Math.floor(Math.random() * 1000),
    }).perform();
    browser.sleep(5);
  }

  waitForElemAndCheckItsText('.dialog-save h2', 'Save your passphrase in a safe place!');

  element(by.css('.dialog-save textarea.passphrase')).getText().then(function(passphrase) {
    expect(passphrase).toBeDefined();
    var passphraseWords = passphrase.split(' ');
    expect(passphraseWords.length).toEqual(12);
    var nextButton = element.all(by.css('.dialog-save .md-button.md-ink-ripple')).get(1);
    nextButton.click();

    element(by.css('.dialog-save p.passphrase span')).getText().then(function(firstPartOfPassphrase) {
      var missingWordIndex = firstPartOfPassphrase.length ?
        firstPartOfPassphrase.split(' ').length :
        0;
      element(by.css('.dialog-save input')).sendKeys(passphraseWords[missingWordIndex]);
      var okButton = element.all(by.css('.dialog-save .md-button.md-ink-ripple')).get(2);
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
  login(masterAccount);
  waitForElemAndCheckItsText('.peer md-select-value .md-text', 'localhost:4000');
}

function testChangePeer() {
  login(masterAccount);

  var peerElem  = element(by.css('.peer md-select-value'));
  browser.wait(EC.presenceOf(peerElem), waitTime);
  peerElem.click();

  var optionElem  = element(by.css('md-select-menu md-optgroup md-option'));
  browser.wait(EC.presenceOf(optionElem), waitTime);
  optionElem.click();

  waitForElemAndCheckItsText('.peer md-select-value .md-text', 'node01.lisk.io');
}

function testShowBalance() {
  login(masterAccount);

  var balanceElem = element(by.css('lsk.balance'));
  browser.wait(EC.presenceOf(balanceElem), waitTime);
  expect(balanceElem.getText()).toMatch(/\d+\.\d+ LSK/);
}

function testSend() {
  send(masterAccount, delegateAccount.address, 1.1);
  checkSendConfirmation();
  logout();

  send(delegateAccount, masterAccount.address, 1);
  checkSendConfirmation();
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

function testLoadMoreTransactions() {
  login(masterAccount);

  var moreButton  = element(by.css('transactions button.more'));
  browser.wait(EC.presenceOf(moreButton), waitTime);
  moreButton.click();

  expect(element.all(by.css('transactions table tbody tr')).count()).toEqual(20);
}

function checkErrorMessage(message) {
  waitForElemAndCheckItsText('send .md-input-message-animation', message);
}

function waitForElemAndCheckItsText(selector, text) {
  var elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime);
  expect(elem.getText()).toEqual(text);
}

function send(fromAccount, toAddress, amount) {
  login(fromAccount);
  var sendElem = element(by.css('send'));
  browser.wait(EC.presenceOf(sendElem), waitTime);
  element(by.css('send input[name="recipient"]')).sendKeys(toAddress);
  element(by.css('send input[name="amount"]')).sendKeys("" + amount);
  var sendButton  = element(by.css('send button.md-primary'));
  browser.wait(EC.presenceOf(sendButton), waitTime);
  sendButton.click();
}

function checkSendConfirmation() {
  waitForElemAndCheckItsText('md-dialog h2', 'Success');
  var okButton = element(by.css('md-dialog .md-button.md-ink-ripple'));
  okButton.click();
  browser.sleep(500);
}

function launchApp() {
  browser.ignoreSynchronization = true;
  browser.get('http://localhost:8080#?peerStack=localhost');
}

function logout() {
  var logoutButton = element(by.css('.logout'));
  browser.wait(EC.presenceOf(logoutButton), waitTime);
  logoutButton.click();
}

function login(account) {
  launchApp();
  element(by.css('input[type="password"]')).sendKeys(account.passphrase);
  element(by.css('.md-button.md-primary.md-raised')).click();
}
