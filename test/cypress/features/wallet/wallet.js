/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import accounts from '../../../constants/accounts';

Given(/^I see 30 transactions$/, function () {
  cy.get(ss.transactionRow).should('have.length', 30);
});

Then(/^I click show more$/, function () {
  cy.get(ss.showMoreButton).click();
});

Then(/^I see more than 30 transactions$/, function () {
  cy.get(ss.transactionRow).should('have.length.greaterThan', 30);
});

Then(/^I click the transaction row$/, function () {
  cy.get(ss.transactionRow).eq(0).click();
});

Then(/^I see outgoing transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains('Second passphrase registration');
});

Then(/^I don't see outgoing transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains('Second passphrase registration').should('not.exist');
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

Then(/^I see incoming transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains(accounts.genesis.address).should('exist');
});

Then(/^I don't see incoming transaction in table$/, function () {
  cy.get(ss.transactionsTable).contains(accounts.genesis.address).should('not.exist');
});

Then(/^I send LSK$/, function () {
  cy.wait('@requestAccountData');
  cy.get(ss.sendToThisAccountBtn).click();
});
