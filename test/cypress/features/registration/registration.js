/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import ss from '../../../constants/selectors';

When(/^I pick an avatar$/, function () {
  cy.get(ss.chooseAvatar).first().click();
  cy.get(ss.getPassphraseButton).click();
});

Given(/^I remember my passphrase$/, function () {
  this.passphrase = [];
  cy.get(ss.copyPassphrase).each(($el) => {
    this.passphrase = [...this.passphrase, $el.val()];
  });
  cy.get(ss.itsSafeBtn).click();
});

Given(/^I confirm my passphrase$/, function () {
  cy.get(ss.passphraseWordConfirm).each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get(ss.passphraseConfirmButton).click();
});

Then(/^I see the success message$/, function () {
  cy.get(ss.app).contains('Your account was created!');
});
