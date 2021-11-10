/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I click filter transactions$/, function () {
  cy.get(ss.filterTransactionsBtn).click();
});

Then(/^I type date from ([^\s]+)$/, function (string) {
  cy.get(ss.dateFromInputFilter).type(string);
});

Then(/^I type date to ([^\s]+)$/, function (string) {
  cy.get(ss.dateToInputFilter).type(string);
});

Then(/^I type amount from ([^\s]+)$/, function (string) {
  cy.get(ss.amountFromInputFilter).type(string);
});

Then(/^I type amount to ([^\s]+)$/, function (string) {
  cy.get(ss.amountToInputFilter).type(string);
});

Then(/^I type message ([^\s]+)$/, function (string) {
  cy.get(ss.messageInputFilter).type(string);
});

Then(/^I apply filters$/, function () {
  cy.get(ss.applyFilters).click();
});

Then(/^I clear all filters$/, function () {
  cy.get(ss.clearAllFiltersBtn).click();
});

Then(/^I should see (\d+) transactions in table$/, function (number) {
  cy.get(ss.transactionRow).should('have.length', number);
});

Then(/^Clear filter containing ([^\s]+)$/, function (string) {
  cy.get(ss.filter).contains('25').parent().find(ss.clearFilterBtn).click();
});

Then(/^I click filter incoming$/, function () {
  cy.get(ss.filterIncoming).click().should('have.class', 'active');
});

Then(/^I click filter outgoing$/, function () {
  cy.get(ss.filterOutgoing).click().should('have.class', 'active');
});



