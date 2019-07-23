/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import ss from '../../../constants/selectors';

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

Given(/^I confirm transaction$/, function () {
  cy.get(ss.confirmDelegateButton).click();
});

Given(/^I see successful message$/, function () {
  cy.wait(txConfirmationTimeout);
  cy.get(ss.app).contains('Delegate registration submitted');
});

Given(/^I see the transaction in transaction list$/, function () {
  cy.get(ss.transactionRow).eq(0).as('tx');
  cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Delegate registration');
});
