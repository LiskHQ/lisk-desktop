/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

Given(/^I autologin as ([^\s]+) to ([^\s]+)$/, function (account, network) {
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
  switch (page) {
    case 'dashboard':
      cy.server();
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
      cy.get(ss.delegateName);
      break;
    default:
      cy.visit(urls[page]);
      break;
  }
});

Then(/^The latest transaction is (.*?)$/, function (transactionType) {
  // cy.get(`${ss.transactionRow} ${ss.spinner}`).should('be.visible');
  if (transactionType.indexOf('transfer') > 0) {
    const transactionAddress = transactionType.split(' ').pop(); // For uses like: 'transfer to 123456L'
    cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', transactionAddress);
  }
  switch (transactionType.toLowerCase()) {
    case 'delegate vote':
    case 'voting':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Delegate vote');
      break;
    case 'second passphrase registration':
    case 'passphrase registration':
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
      cy.get(ss.accountAddress).contains(identifier);
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

Then(/^I click on recent transaction$/, function () {
  cy.get(ss.transactionRow).eq(0).click();
});

Then(/^I click on recent bookmark$/, function () {
  cy.get(ss.bookmarkAccount).eq(0).click();
});
