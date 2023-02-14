/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, accounts, urls } from '../../../constants';

Given(/^I am on Wallet page of validator$/, function () {
  cy.visit(`${urls.explorer}?address=lskdxwf9kgmfghoeevqhrkcruy8j7xpkw57un9avq`);
});

Then(/^I should see more than ([^\s]+) transactions$/, function (trnxNumber) {
  cy.get(ss.transactionRow).should('have.length.greaterThan', Number(trnxNumber));
});

Then(/^I should see incoming transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains('16278883833535792633L').should('exist');
});

Then(/^I should not see incoming transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains(accounts.genesis.summary.address).should('not.exist');
});

Then(/^I click filter incoming$/, function () {
  cy.get(ss.filterIncoming).click().should('have.class', 'active');
});

Then(/^I click filter all$/, function () {
  cy.get(ss.filterAll).click().should('have.class', 'active');
});

Then(/^I click filter outgoing$/, function () {
  cy.get(ss.filterOutgoing).click().should('have.class', 'active');
});

Then(/^I send LSK$/, function () {
  cy.get(ss.sendLink).click({ force: true });
});

Then(/^I should see ([^s]+) in recipient$/, function (accountName) {
  cy.get(ss.recipientInput).should('have.value', accounts[accountName].summary.address);
});

Then(/^I should have (.+) in recipient field$/, function (walletAddress) {
  cy.get(ss.recipientInput).should('have.value', walletAddress);
});
