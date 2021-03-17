/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '@constants';

Then(/^I should see that (.*?) LSK are locked$/, function (amount) {
  cy.wait(10000);
  cy.get(`${ss.openUnlockBalanceDialog}`).eq(0).contains(amount);
});

Then(/^I should see unlocking balance (.*?)$/, function (amount) {
  cy.get(`${ss.unlockingBalance}`).eq(0).contains(amount);
});
