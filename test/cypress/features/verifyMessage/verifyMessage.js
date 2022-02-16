/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

When(/^I paste (.+) in ([\w]+) field$/, function (value, field) {
  cy.get(ss[field]).clear().invoke('val', value.slice(0, value.length - 1)).type(value.slice(-1))
});

Then(/I should have the signed message in the clipboard/, function(){
  cy.window().then((win) => {
    const signedMessage = win.document.querySelector(ss.signedResult).innerHTML

    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.eq(signedMessage);
    });
  });
})

Then(/I should have the clipboard value in the verify input textarea/, function(){
  cy.window().then((win) => {
    const verifyInput = win.document.querySelector(ss.verifyMessageTextArea).innerHTML

    win.navigator.clipboard.readText().then((text) => {
      expect(verifyInput).to.eq(text);
    });
  });
})

Then(/(\w+) should have value of (\w+)/, function(field, value){
  cy.get(ss[field]).should('have.value', value);
})

When(/^I paste clipboardValue in ([\w]+) field$/, function (field) {
  const clipboardValue = window.navigator.clipboard.readText();
  cy.get(ss[field]).clear().invoke('val', clipboardValue.slice(0, clipboardValue.length - 1)).type(value.slice(-1))
});