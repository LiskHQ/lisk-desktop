/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import ss from '../../../constants/selectors';

const randomDelegateName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

Given(/^I am on Second passphrase registration page$/, function () {
  cy.visit(urls.secondPassphrase);
});

Given(/^I enter the delegate name$/, function () {
  cy.get(ss.delegateNameInput).click().type(randomDelegateName);
  cy.wait(1200);
});

Given(/^I go to confirmation$/, function () {
  cy.get(ss.goToConfirmation).click();
});

Given(/^I confirm transaction$/, function () {
  cy.get(ss.confirmationCheckbox).click();
  cy.get(ss.confirmButton).click();
});

Given(/^I see the transaction in transaction list$/, function () {
  cy.wait(1000);
  cy.get(`${ss.transactionRow} ${ss.spinner}`).should('be.visible');
  cy.get(ss.transactionRow).eq(0).find(ss.transactionAddress).contains('Second passphrase registration');
});
