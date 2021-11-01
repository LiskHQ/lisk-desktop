/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, networks, accounts } from '../../../constants';

Then(/^I should see 30 transactions$/, function () {
  cy.get(ss.transactionRow).should('have.length', 30);
});

Then(/^I click show more$/, function () {
  cy.get(ss.showMoreButton).click();
});

Then(/^I should see more than 30 transactions$/, function () {
  cy.get(ss.transactionRow).should('have.length.greaterThan', 30);
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
