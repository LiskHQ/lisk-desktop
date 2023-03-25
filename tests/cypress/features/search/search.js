/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

And(/^I search for validator ([^s]+)$/, function (string) {
  cy.wait(100);
  cy.get(ss.searchInput).type(string);
});

And(/^I search for transaction ([^s]+)$/, function (string) {
  cy.wait(100);
  cy.get(ss.searchInput).type(string);
});

Then(/^I should see no results$/, function () {
  cy.get(ss.searchMessage).eq(0).should('have.text', 'Nothing has been found for your search');
});
