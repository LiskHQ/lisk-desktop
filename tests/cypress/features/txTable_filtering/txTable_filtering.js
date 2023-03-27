/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I type date from ([^\s]+)$/, function (string) {
  cy.get(ss.dateFromInputFilter).type(string);
});

Then(/^I type date to ([^\s]+)$/, function (string) {
  cy.get(ss.dateToInputFilter).type(string);
});

Then(/^I type date to ([^\s]+)$/, function (string) {
  cy.get(ss.dateToInputFilter).type(string);
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
