var testAcocunt = {
 passphrase: 'stay undo beyond powder sand laptop grow gloom apology hamster primary arrive',
 address: '5932438298200837883L',
};
var EC = protractor.ExpectedConditions;

describe('Lisk Nano functionality', function() {
  it('should allow to login', testLogin);
  it('should allow to logout', testLogout);
  it('should allow to create a new account', testUndefined);
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
  
  var elem = element(by.css('.logout'));
  browser.wait(EC.presenceOf(elem), 10000);
  expect(elem.getText()).toEqual('LOGOUT');
}

function testLogout() {
  login(testAcocunt);
  
  var logoutButton = element(by.css('.logout'));
  browser.wait(EC.presenceOf(logoutButton), 10000);
  logoutButton.click();

  var loginButton = element(by.css('.md-button.md-primary.md-raised'));
  browser.wait(EC.presenceOf(loginButton), 10000);
  expect(loginButton.getText()).toEqual('LOGIN');
}

function testAddress() {
  login(testAcocunt);
  
  var addressElem = element(by.css('.address'));
  browser.wait(EC.presenceOf(addressElem), 10000);
  expect(addressElem.getText()).toEqual(testAcocunt.address);
}

function testPeer() {
  login(testAcocunt);
  
  var peerElem  = element(by.css('.peer md-select-value .md-text'));
  browser.wait(EC.presenceOf(peerElem), 10000);
  expect(peerElem.getText()).toMatch(/node0\d.lisk.io/);
}

function login(account) {
  browser.ignoreSynchronization = true;
  browser.get('http://localhost:8080#?peerStack=localhost');
  element(by.css('input[type="password"]')).sendKeys(account.passphrase);
  element(by.css('.md-button.md-primary.md-raised')).click();
}
