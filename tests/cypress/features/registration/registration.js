/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Given(/^I remember my passphrase$/, function () {
  this.passphrase = [];
  cy.get(ss.copyPassphrase).each(($el) => {
    this.passphrase = [...this.passphrase, $el[0].textContent];
  });
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
});
