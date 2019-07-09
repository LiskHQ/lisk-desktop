/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

Given(/^I autologin as ([^\s]+) to ([^\s]+)$/, function (account, network) {
  localStorage.setItem('liskCoreUrl', networks[network].node);
  localStorage.setItem('loginKey', accounts[account].passphrase);
});

Given(/^I login as ([^\s]+)$/, function (accountName) {
  const passphrase = accounts[accountName].passphrase;
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
});

Given(/^I am on Wallet page$/, function () {
  cy.visit(urls.wallet);
});

Then(/^I enter second passphrase of ([^\s]+)$/, function (account) {
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = accounts[account].secondPassphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
});

Then(/^The latest transaction is voting$/, function () {
  cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', 'Delegate vote');
});

Then(/^I am on transaction details page$/, function () {
  cy.get(ss.app).contains('Confirmations');
});

Then(/^I am on account page$/, function () {
  cy.get(ss.accountName).should('be.visible');
});
