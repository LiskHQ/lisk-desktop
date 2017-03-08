var testAcocunt = {
 passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
 address: '5932438298200837883L',
};
var EC = protractor.ExpectedConditions;
var waitTime = 5000;

describe('Lisk Nano functionality', function() {
  it('should allow to login', testLogin);
  it('should allow to logout', testLogout);
  it('should allow to create a new account', testNewAccount);
  it('should show address', testAddress);
  it('should show peer', testPeer);
  it('should allow to change peer', testUndefined);
  it('should show balance', testUndefined);
  it('should allow to send transaction when enough funds and correct address form', testUndefined);
  it('should not allow to send transaction when not enough funds', testUndefined);
  it('should not allow to send transaction when incorrect address form', testUndefined);
  it('should show transactions', testUndefined);
  it('should allow to load more transactions', testUndefined);
});


function testUndefined() {
  throw 'Not defined yet.';
}

function testLogin() {
  login(testAcocunt);
  checkIsLoggedIn();
}
 
function checkIsLoggedIn() {
  var elem = element(by.css('.logout'));
  browser.wait(EC.presenceOf(elem), waitTime);
  expect(elem.getText()).toEqual('LOGOUT');
}

function testLogout() {
  login(testAcocunt);
  
  var logoutButton = element(by.css('.logout'));
  browser.wait(EC.presenceOf(logoutButton), waitTime);
  logoutButton.click();

  var loginButton = element(by.css('.md-button.md-primary.md-raised'));
  browser.wait(EC.presenceOf(loginButton), waitTime);
  expect(loginButton.getText()).toEqual('LOGIN');
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

  var saveDialogH2 = element(by.css('.dialog-save h2'));
  browser.wait(EC.presenceOf(saveDialogH2), waitTime);
  expect(saveDialogH2.getText()).toEqual('Save your passphrase in a safe place!');
  
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
      var nextButton = element.all(by.css('.dialog-save .md-button.md-ink-ripple')).get(2);
      nextButton.click();

      checkIsLoggedIn();
    });
  });
}

function testAddress() {
  login(testAcocunt);
  
  var addressElem = element(by.css('.address'));
  browser.wait(EC.presenceOf(addressElem), waitTime);
  expect(addressElem.getText()).toEqual(testAcocunt.address);
}

function testPeer() {
  login(testAcocunt);
  
  var peerElem  = element(by.css('.peer md-select-value .md-text'));
  browser.wait(EC.presenceOf(peerElem), waitTime);
  expect(peerElem.getText()).toEqual('localhost:4000');
}

function launchApp() {
  browser.ignoreSynchronization = true;
  browser.get('http://localhost:8080#?peerStack=localhost');
}

function login(account) {
  launchApp();
  element(by.css('input[type="password"]')).sendKeys(account.passphrase);
  element(by.css('.md-button.md-primary.md-raised')).click();
}
