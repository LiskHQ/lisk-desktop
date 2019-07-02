/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';

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
