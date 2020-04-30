/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import ss from '../../../constants/selectors';

const randomDelegateName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

Given(/^I enter the delegate name$/, function () {
  cy.get(ss.delegateNameInput).click().type(randomDelegateName);
  cy.wait(1200);
});

Given(/^I remember my passphrase$/, function () {
  this.passphrase = [];
  cy.get(ss.copyPassphrase).each(($el) => {
    this.passphrase = [...this.passphrase, $el[0].textContent];
  });
  cy.get(ss.goToConfirmation).click();
});

Given(/^I confirm my passphrase$/, function () {
  cy.get(ss.copyPassphrase).each(($wordElement) => {
    if ($wordElement[0].className.includes('empty')) {
      cy.wrap($wordElement).click();
      cy.get(ss.passphraseWordConfirm).each(($option) => {
        if (this.passphrase.includes($option[0].textContent)) cy.wrap($option).click();
      });
    }
  });
  cy.get(ss.passphraseConfirmButton).click();
});
