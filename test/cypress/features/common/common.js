/* eslint-disable */
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

const txConfirmationTimeout = 15000;

Given(/^I login as ([^\s]+) on ([^\s]+)$/, function (account, network) {
  cy.autologin(accounts[account].passphrase, networks[network].node);
});

Given(/^I login$/, function () {
  cy.server();
  cy.route('/account/**').as('btcAccount');
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
  cy.wait('@btcAccount');
});

Then(/^I enter ([^\s]+) passphrase of ([^\s]+)$/, function (passphraseType, accountName) {
  const passphrase = accounts[accountName][(passphraseType === 'second') ?  'secondPassphrase' : 'passphrase'];
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
      cy.route('/api/node/constants').as('constants');
      cy.visit(urls.dashboard).then(() => {
        const liskCoreUrl = window.localStorage.getItem('liskCoreUrl');
        const isDevNet = liskCoreUrl !== 'https://testnet.lisk.io' && liskCoreUrl !== null;
        if (isDevNet) cy.wait('@constants');
      });
      break;
    case 'second passphrase registration':
      cy.visit(urls.secondPassphrase);
      break;
    case 'register delegate':
      cy.visit(urls.registerDelegate);
      break;
    case 'delegates':
      cy.visit(urls.delegates);
      // cy.route('/api/delegates**').as('requestDelegate');
      // cy.wait('@requestDelegate');
      break;
    case 'wallet':
      cy.route('/api/transactions?*').as('transactions');
      cy.route('/api/votes?*').as('votes');
      cy.visit(urls.wallet);
      cy.wait('@transactions');
      cy.wait('@votes');
      break;
    case 'send':
      cy.route('/api/accounts?address*').as('accountLSK');
      cy.route('/account/*').as('accountBTC');
      cy.visit(urls.send);
      cy.wait('@accountLSK');
      cy.wait('@accountBTC');
      break;
    case 'login':
      cy.visit('/login');
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
      cy.route('/api/transactions?*').as('transactions');
      cy.visit(`${urls.account}?address=${accounts[identifier].address}`);
      cy.wait('@transactions');
      break;
  }
});

Given(/^I scroll to (.*?)$/, (position) => {
  cy.get('.scrollContainer').scrollTo(position);
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
    case 'delegate vote':
    case 'voting':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Delegate vote');
      break;
    case 'second passphrase registration':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Second passphrase registration');
      break;
    case 'delegate registration':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Delegate registration');
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
      cy.route('/api/accounts?address=**').as('requestAccountData');
      cy.visit(`${urls.accounts}/${accounts[identifier].address}`);
      cy.wait('@requestAccountData');
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

Then(/^The (.*?) button must be active$/, function (elementName) {
  cy.get(ss[elementName]).should('not.be.disabled');
});
