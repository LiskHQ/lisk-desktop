/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

When(/^I pick an avatar$/, function () {
  cy.get(ss.chooseAvatar).first().click();
  cy.get(ss.getPassphraseButton).click();
});

Given(/^I remember my passphrase$/, function () {
  this.passphrase = [];
  cy.get(ss.copyPassphrase).each(($el) => {
    this.passphrase = [...this.passphrase, $el[0].textContent];
  });
  cy.get(ss.itsSafeBtn).click();
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

Then(/^I see the success message$/, function () {
  cy.get(ss.app).contains('Perfect! Almost done');
});
