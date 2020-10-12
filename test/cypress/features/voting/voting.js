/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

Then(/^I should see unlocking balance (.*?)$/, function (amount) {
  cy.get(`${ss.unlockingBalance}`).eq(0).contains(amount);
  cy.wait(1000);
});