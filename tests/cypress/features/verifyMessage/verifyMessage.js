/* eslint-disable */
import { And, Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

Then(/^I verify signed message in (\w+)$/, function (field) {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((clipboardValue) => {
      cy.get(ss[field]).type(clipboardValue);
      cy.get(ss.continueBtn).eq(0).click();
      cy.get(ss.app).contains('Signature is correct');
    });
  });
});
