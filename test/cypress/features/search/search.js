/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

And(/^I search for delegate ([^s]+)$/, function (string) {
  cy.wait(100);
  cy.get(ss.searchInput).type(string);
});

And(/^I search for transaction ([^s]+)$/, function (string) {
  cy.wait(100);
  cy.get(ss.searchInput).type(string);
});

Then(/^I should see no results$/, function () {
  cy.get(ss.searchMessage).eq(0).should('have.text', 'Nothing has been found. Make sure to double check the ID you typed.');
});
