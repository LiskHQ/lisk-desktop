const fs = require('fs');

const masterAccount = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  address: '16313739661670634666L',
};

const delegateAccount = {
  passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  address: '537318935439898807L',
  username: 'genesis_17',
};

const emptyAccount = {
  passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
  address: '5932438298200837883L',
};

const accountDelegateCandidate = {
  passphrase: 'right cat soul renew under climb middle maid powder churn cram coconut',
  address: '544792633152563672L',
  username: 'test',
};

const account2ndPassphraseCandidate = {
  passphrase: 'dolphin inhale planet talk insect release maze engine guilt loan attend lawn',
  address: '4264113712245538326L',
};

const EC = protractor.ExpectedConditions;
const waitTime = 5000;

function waitForElemAndCheckItsText(selector, text) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`);
  expect(elem.getText()).toEqual(text, `inside element "${selector}"`);
}

function waitForElemAndClickIt(selector) {
  const elem = element(by.css(selector));
  browser.wait(EC.presenceOf(elem), waitTime, `waiting for element '${selector}'`);
  elem.click();
}

function checkErrorMessage(message) {
  waitForElemAndCheckItsText('send .md-input-message-animation', message);
}

function launchApp() {
  browser.ignoreSynchronization = true;
  browser.driver.manage().window().setSize(1000, 1000);
  browser.refresh();
  browser.get('http://localhost:8080#/?peerStack=localhost');
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

  // wait for modal animation to finish
  browser.sleep(1000);
  element(by.css('send input[name="recipient"]')).sendKeys(toAddress);
  element(by.css('send input[name="amount"]')).sendKeys(`${amount}`);
  element(by.css('send input[name="recipient"]')).click();
  const sendButton = element.all(by.css('send button.md-primary')).get(0);
  // browser.wait(EC.presenceOf(sendButton), waitTime);
  sendButton.click();
}

function checkAlertDialog(title, text) {
  waitForElemAndCheckItsText('md-dialog h2', title);
  waitForElemAndCheckItsText('md-dialog .md-dialog-content-body', text);
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

function doPassphraseGenerationProcedure(callback) {
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

      callback();
    });
  });
}

function testNewAccount() {
  launchApp();

  element.all(by.css('.md-button.md-primary')).get(0).click();
  doPassphraseGenerationProcedure(checkIsLoggedIn);
}

function testAddress() {
  login(masterAccount);
  waitForElemAndCheckItsText('.address', masterAccount.address);
}

function testPeer() {
  launchApp();
  login(masterAccount);
  expect(element.all(by.css('.peer .md-title')).get(0).getText()).toEqual('Peer');
  expect(element.all(by.css('.peer .value')).get(0).getText()).toEqual('localhost:4000');
}

function testChangeNetwork() {
  launchApp();

  const peerElem = element(by.css('form md-select'));
  browser.wait(EC.presenceOf(peerElem), waitTime);
  peerElem.click();

  const optionElem = element.all(by.css('md-select-menu md-option')).get(1);
  browser.wait(EC.presenceOf(optionElem), waitTime);
  optionElem.click();

  waitForElemAndCheckItsText('form md-select-value .md-text', 'Testnet');
}

function testShowBalance() {
  login(masterAccount);

  const balanceElem = element(by.css('lsk.balance'));
  browser.wait(EC.presenceOf(balanceElem), waitTime);
  expect(balanceElem.getText()).toMatch(/\d+(\.\d+)? LSK/);
}

function testSend() {
  const amount = 1.1;
  send(masterAccount, delegateAccount.address, amount);
  browser.sleep(1000);
  checkAlertDialog('Success', `${amount} sent to ${delegateAccount.address}`);
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

function testSignMessage() {
  const message = 'Hello world';
  const result =
    '-----BEGIN LISK SIGNED MESSAGE-----\n' +
    '-----MESSAGE-----\n' +
    'Hello world\n' +
    '-----PUBLIC KEY-----\n' +
    'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f\n' +
    '-----SIGNATURE-----\n' +
    '079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0' +
    'c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64\n' +
    '-----END LISK SIGNED MESSAGE-----';

  login(masterAccount);
  waitForElemAndClickIt('header .md-icon-button');
  browser.sleep(1000);
  waitForElemAndClickIt('md-menu-item .md-button');
  element(by.css('textarea[name="message"]')).sendKeys(message);
  browser.sleep(1000);
  expect(element(by.css('textarea[name="result"]')).getAttribute('value')).toEqual(result);
}

function testVerifyMessage() {
  const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
  const signature = '079331d868678fd5f272f09d6dc8792fb21335aec42af7f11caadbfbc17d4707e7d7f343854b0' +
    'c619b647b81ba3f29b23edb4eaf382a47c534746bad4529560b48656c6c6f20776f726c64';
  const message = 'Hello world';

  login(masterAccount);
  waitForElemAndClickIt('header .md-icon-button');
  browser.sleep(1000);
  waitForElemAndClickIt('md-menu-item:nth-child(2) .md-button');
  element(by.css('input[name="publicKey"]')).sendKeys(publicKey);
  element(by.css('textarea[name="signature"]')).sendKeys(signature);
  browser.sleep(1000);
  expect(element(by.css('textarea[name="result"]')).getAttribute('value')).toEqual(message);
}

function test2ndPassphrase() {
  login(account2ndPassphraseCandidate);
  waitForElemAndClickIt('header .md-icon-button');
  browser.sleep(1000);
  waitForElemAndClickIt('md-menu-item:nth-child(3) .md-button');
  doPassphraseGenerationProcedure(() => {
    browser.sleep(500);
    checkAlertDialog('Success', 'Your second passphrase was successfully registered.');
  });
}

function testDelegateRegistration() {
  login(accountDelegateCandidate);
  waitForElemAndClickIt('header .md-icon-button');
  browser.sleep(1000);
  waitForElemAndClickIt('md-menu-item:nth-child(4) .md-button');
  browser.sleep(500);
  element(by.css('md-dialog input[name="delegateName"]')).sendKeys(accountDelegateCandidate.username);
  waitForElemAndClickIt('md-dialog button.md-primary');

  browser.sleep(500);
  // FIXME: the title should really be "Success", not "Congratulations!" to be consistent
  checkAlertDialog('Congratulations!', 'Account was successfully registered as delegate.');
}

function testForgingCenter() {
  login(delegateAccount);
  waitForElemAndClickIt('main md-tab-item:nth-child(3)');

  // FIXME: there is some bug in forging center that makes it really slow to load
  browser.sleep(5000);

  waitForElemAndCheckItsText('forging md-card .title', delegateAccount.username);
  waitForElemAndCheckItsText('forging md-card md-card-title .md-title', 'Forged Blocks');
}

function testViewDelegates() {
  login(masterAccount);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndCheckItsText('delegates table thead tr th:nth-child(1)', 'Vote');
  waitForElemAndCheckItsText('delegates table tbody tr td:nth-child(2)', '1');

  // FIXME: there are 20 delegates displayed, so this should be toEqual(20)
  // but we have to use ng-if instead of ng-hide for tr with "No delegates found" message
  expect(element.all(by.css('delegates table tbody tr')).count()).toEqual(21);
}

function testSearchDelegates() {
  login(masterAccount);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndCheckItsText('delegates table thead tr th:nth-child(1)', 'Vote');
  element(by.css('delegates input[name="name"]')).sendKeys(delegateAccount.username);
  browser.sleep(500);
  waitForElemAndCheckItsText('delegates table tbody tr td:nth-child(3)', delegateAccount.username);

  // FIXME: there should be 1 delegate displayed, so this should be toEqual(1)
  // but we have to use ng-if instead of ng-hide for tr with "No delegates found" message
  expect(element.all(by.css('delegates table tbody tr')).count()).toEqual(2);
}

function testViewVotes() {
  login(masterAccount);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndCheckItsText('delegates md-menu button span.ng-scope', 'MY VOTES (101)');
  waitForElemAndClickIt('delegates md-menu button');
  browser.sleep(500);
  expect(element.all(by.css('md-menu-item.vote-list-item')).count()).toEqual(101);
}

function testVoteFromTable() {
  login(accountDelegateCandidate);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndClickIt('delegates tr:nth-child(3) md-checkbox');
  waitForElemAndClickIt('delegates tr:nth-child(5) md-checkbox');
  waitForElemAndClickIt('delegates tr:nth-child(8) md-checkbox');
  // FIXME: add 'vote-button' class the "Vote" button and use it here
  element.all(by.css('delegates md-card-title button')).last().click();
  // FIXME: add 'md-primary' class the "Confirm vote" button and use it here
  waitForElemAndClickIt('vote md-dialog-actions button[ng-disabled]');
  waitForElemAndCheckItsText('md-toast', 'Voting successful');
}

function testVoteFromDialog() {
  login(accountDelegateCandidate);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndClickIt('delegates tr:nth-child(3) md-checkbox');
  waitForElemAndClickIt('delegates tr:nth-child(3) md-checkbox');
  // FIXME: add 'vote-button' class the "Vote" button and use it here
  element.all(by.css('delegates md-card-title button')).last().click();
  element(by.css('md-autocomplete-wrap input')).sendKeys('genesis_7');
  waitForElemAndClickIt('md-autocomplete-parent-scope');
  element(by.css('md-autocomplete-wrap input')).sendKeys('genesis_7');
  waitForElemAndClickIt('md-autocomplete-parent-scope');
  // FIXME: add 'md-primary' class the "Confirm vote" button and use it here
  waitForElemAndClickIt('vote md-dialog-actions button[ng-disabled]');
  waitForElemAndCheckItsText('md-toast', 'Voting successful');
}

function testUnvote() {
  login(masterAccount);
  waitForElemAndClickIt('main md-tab-item:nth-child(2)');
  waitForElemAndClickIt('delegates tr:nth-child(3) md-checkbox');
  waitForElemAndClickIt('delegates tr:nth-child(5) md-checkbox');
  waitForElemAndClickIt('delegates tr:nth-child(8) md-checkbox');
  // FIXME: add 'vote-button' class the "Vote" button and use it here
  element.all(by.css('delegates md-card-title button')).last().click();
  // FIXME: add 'md-primary' class the "Confirm vote" button and use it here
  waitForElemAndClickIt('vote md-dialog-actions button[ng-disabled]');
  waitForElemAndCheckItsText('md-toast', 'Voting successful');
}

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function takeScreenshotAfterFail() {
  const currentSpec = jasmine.getEnv().currentSpec;
  const specSlug = slugify([currentSpec.id, currentSpec.description].join(' '));
  if (currentSpec.failedExpectations.length) {
    browser.takeScreenshot().then((png) => {
      const dirName = 'e2e-test-screenshots';
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName);
      }
      writeScreenShot(png, `${dirName}/${specSlug}.png`);
    });
  }
}


describe('Lisk Nano', () => {
  afterEach(takeScreenshotAfterFail);

  describe('Login page', () => {
    it('should allow to login', testLogin);
    it('should allow to change network', testChangeNetwork);
    it('should allow to create a new account', testNewAccount);
  });

  describe('Main page top area', () => {
    it('should allow to logout', testLogout);
    it('should show peer', testPeer);
    it('should show address', testAddress);
    it('should show balance', testShowBalance);
  });

  describe('Top right menu', () => {
    it('should allow to sign message', testSignMessage);
    it('should allow to verify message', testVerifyMessage);
    it('should allow to set 2nd passphrase', test2ndPassphrase);
    it('should allow to register a delegate', testDelegateRegistration);
  });

  describe('Send dialog', () => {
    it('should allow to send transaction when enough funds and correct address form', testSend);
    // FIXME: there is currently a bug - #194 Maximum amount validation doesn't work
    xit('should not allow to send transaction when not enough funds', testSendWithNotEnoughFunds);
    it('should not allow to send transaction when invalid address', testSendWithInvalidAddress);
  });

  describe('Transactions tab', () => {
    it('should show transactions', testShowTransactions);
  });

  describe('Forging tab', () => {
    it('should allow to view forging center if account is delegate', testForgingCenter);
  });

  describe('Voting tab', () => {
    it('should allow to view delegates', testViewDelegates);
    it('should allow to search delegates', testSearchDelegates);
    it('should allow to view my votes', testViewVotes);
    // FIXME: voting is broken, because it sends secondPassphrase = undefined
    xit('should allow to select delegates in the "Voting" tab and vote for them', testVoteFromTable);
    // FIXME: voting is broken, because it sends secondPassphrase = undefined
    xit('should allow to select delegates in the "Vote" dialog and vote for them', testVoteFromDialog);
    // FIXME: voting is broken, because it sends secondPassphrase = undefined
    xit('should allow to remove votes form delegates', testUnvote);
  });
});
