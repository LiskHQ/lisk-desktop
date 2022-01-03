/* eslint-disable */
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { networks, urls, accounts, ss, settings } from '../../../constants';

const txConfirmationTimeout = 15000;

Given(/^Network switcher is (enabled|disabled)$/, function (status) {
  const showNetwork = status === 'enabled';
  console.log('showNetwork', showNetwork);
  window.localStorage.setItem('settings', 
    JSON.stringify({ ...settings, 'showNetwork': showNetwork }));
});

Given(/^Network is set to testnet$/, function () {
  window.localStorage.setItem('settings', 
    JSON.stringify({ ...settings, 'showNetwork': true, network: { name: 'testnet', address:'https://testnet-service.lisk.com' } }));
});

Given(/^Network is set to ([^\s]+)$/, function (network) {
  window.localStorage.setItem('settings', 
    JSON.stringify({ ...settings, 'showNetwork': true, network: { name: network, address:networks[network].serviceUrl } }));
});

Given(/^I login as ([^\s]+) on ([^\s]+)$/, function (account, network) {
  cy.visit(urls.login);
  cy.get(ss.networkDropdown).click();
  cy.get(ss.networkOptions).eq(2).click();
  cy.get(ss.addressInput).clear().type(networks[network].serviceUrl);
  cy.get(ss.connectButton).click();

  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = accounts[account].passphrase.split(' ');
    cy.wrap($el, { log: false }).type(passphraseWordsArray[index], { log: false });
  });
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
});

Given(/^I login$/, function () {
  cy.server();
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
});

Then(/^I enter the passphrase of ([^\s]+)$/, function (accountName) {
  const passphrase = accounts[accountName]['passphrase'];
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
});

Given(/^I am on (.*?) page$/, function (page) {
  page = page.toLowerCase();
  cy.server();
  switch (page) {
    case 'dashboard':
      cy.visit(urls.dashboard);
      break;
    case 'register delegate':
      cy.visit(urls.registerDelegate);
      break;
    case 'delegates':
      cy.visit(urls.delegates);
      break;
    case 'wallet':
      cy.visit(urls.wallet);
      break;
    case 'send':
      cy.visit(urls.send);
      break;
    case 'login':
      cy.visit(urls.login);
      break;
    default:
      cy.visit(urls[page]);
      break;
  }
});

Given(/^I am on (.*?) page of (.*?)$/, function (page, identifier) {
  cy.server();
  switch (page.toLowerCase()) {
    case 'wallet':
      cy.visit(`${urls.account}?address=${accounts[identifier].summary.address}`);
      break;
  }
});

Given(/^I scroll to (.*?)$/, (position) => {
  cy.get('.scrollContainer').scrollTo(position, { ensureScrollable: false });
});

Then(/^I should see pending transaction$/, function () {
  cy.get(`${ss.transactionRow} ${ss.spinner}`).should('be.visible');
});

Then(/^I should not see pending transaction$/, function () {
  cy.get(`${ss.transactionRow} ${ss.spinner}`, { timeout: txConfirmationTimeout }).should('be.not.visible');
});

Then(/^I see this title: (.*?)$/, function (title) {
  cy.get(ss.app).contains(title);
});

Then(/^The latest transaction is (.*?)$/, function (transactionType) {
  cy.wait(1000);
  if (transactionType.toLowerCase().indexOf('transfer') > -1) {
    const transactionRecipient = transactionType.split(' ').pop();
    if (transactionRecipient === 'random') {
      /* For use: 'transfer to random' */
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', this.randomAddress);
    } else if (transactionRecipient === 'transfer') {
      throw new Error('Usage: "transfer to {recipient}" where recipient could be "random" or account name');
    } else {
      /* For uses like: 'transfer to mkakDp2f31btaXdATtAogoqwXcdx1PqqFo' */
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains(transactionRecipient.substring(0,10));
    }
  }
  switch (transactionType.toLowerCase()) {
    case 'unlocking':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Unlock');
      break;
    case 'voting':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Delegate vote');
      break;
    case 'delegate registration':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Delegate registration');
      break;
    case 'register delegate':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Register delegate');
      break;
    case 'vote':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Vote');
      break;
  }
});

Then(/^I should be on (.*?) page$/, function (pageName) {
  switch (pageName.toLowerCase()) {
    case 'tx details':
      cy.get(ss.app).contains('Confirmations');
      break;
    case 'account':
      cy.get(ss.accountName).should('be.visible');
      break;
  }
});

Then(/^I should see (\d+) transactions in table$/, function (number) {
  cy.get(ss.transactionRow).should('have.length', number);
});

Then(/^I should see (.*?)$/, function (elementName) {
  cy.get(ss[elementName]).should('be.visible');
});

Then(/^I should be on (.*?) page of (.*?)$/, function (pageName, identifier) {
  switch (pageName.toLowerCase()) {
    case 'account':
      cy.get(ss.accountName).contains(identifier.substr(0, 10));
      break;
    case 'delegates':
      cy.get(ss.accountName).should('have.text', identifier);
      break;
    case 'tx details':
      cy.get(ss.transactionId).should('have.text', identifier);
      break;
    case 'wallet':
      cy.server();
      cy.visit(`${urls.accounts}/${accounts[identifier].address}`);
  }
});

Then(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

Given(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

When(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

When(/^I clear input (.*?)$/, function (elementName) {
  cy.get(ss[elementName]).clear();
});

When(/^I fill ([\w]+) in ([\w]+) field$/, function (value, field) {
  cy.get(ss[field]).type(value);
});

Then(/^I fill ([^s]+) in ([^s]+) field$/, function (value, field) {
  cy.get(ss[field]).type(value);
});

Then(/^I go to transfer confirmation$/, function () {
  cy.get(ss.nextTransferBtn).should('be.enabled');
  cy.get(ss.nextTransferBtn).click();
});

Then(/^(.*?) should be visible$/, function (elementName) {
  cy.get(ss[elementName]).should('be.visible');
});

Then(/^The (.*?) button must (.*?) active$/, function (elementName, check) {
  if (check === 'be') {
    cy.get(ss[elementName]).should('not.be.disabled');
  } else if (check === 'not be') {
    cy.get(ss[elementName]).should('be.disabled');
  }
});

And(/^I search for account (.*?)$/, function (string) {
  cy.server();
  cy.get(ss.searchInput).type(string);
});

Then(/^I wait (.*?) seconds$/, function (seconds) {
  cy.wait(Number(seconds) * 1000);
});


