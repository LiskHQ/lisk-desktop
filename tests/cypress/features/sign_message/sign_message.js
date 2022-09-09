/* eslint-disable */
import ss from '../../../constants/selectors';
import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(/I should have the signed message in the clipboard/, function () {
  cy.window().then((win) => {
    const signedMessage = win.document.querySelector(ss.signedResult).innerHTML;

    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.eq(signedMessage);
    });
  });
});

Then(/(\w+) should have value of (\w+)/, function (field, value) {
  cy.get(ss[field]).should('have.value', value);
});
