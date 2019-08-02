/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import ss from '../../../constants/selectors';

const randomDelegateName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

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
