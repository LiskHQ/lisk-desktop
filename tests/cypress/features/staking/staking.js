/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I should see that (.*?) LSK are locked$/, function (amount) {
  cy.wait(500);
  cy.get(`${ss.unlockAmountValue}`).eq(0).contains(amount);
});

Then(/^I should see unlocking balance (.*?)$/, function (amount) {
  cy.get(`${ss.unlockingBalance} > p:first-child`).eq(0).contains(amount);
});

Then(/^I should see available balance (.*?)$/, function (amount) {
  cy.get(`${ss.availableBalance}`).eq(0).contains(amount);
});

