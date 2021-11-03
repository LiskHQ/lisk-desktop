/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import { urls, ss } from '../../../constants';

const txConfirmationTimeout = 12000;
const txDelegateRegPrice = 25;
const getRandomDelegateName = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

Given(/^I enter the delegate name$/, function () {
  const randomDelegateName = getRandomDelegateName();
  cy.get(ss.delegateNameInput).click().type(randomDelegateName);
  cy.wait(1200);
});

Given(/^I go to confirmation$/, function () {
  cy.get(ss.chooseDelegateName).click();
});

Given(/^I see successful message$/, function () {
  cy.wait(txConfirmationTimeout);
  cy.get(ss.app).contains('Delegate registration submitted');
});
