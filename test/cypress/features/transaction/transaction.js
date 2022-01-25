/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Given(/^Given I am on Transactions page$/, function () {
	cy.visit('/transactions');
})

Then(/^I should see more than ([^\s]+) transactions in table$/, function (trnxNumber) {
  cy.get(ss.transactionRow).should('have.length.greaterThan', Number(trnxNumber));
});
