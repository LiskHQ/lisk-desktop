/* eslint-disable */
import { When } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

When(/^I select ([^\s]+) in ([^\s]+) field$/, function (value, field) {
  cy.get(ss[field]).click()
  cy.get('.options').contains(value).click();
});

Then(/^I should be on transaction details modal$/, function () {
  cy.location().should((location) => {
    const hasAddress = /\?modal=transactionDetails&transactionID=f3f4755b31eae903c8cf1e35f123e907fd8ed8e2b9feeae39bedd5c495326d62/.test(location.href);
    expect(hasAddress).true;
  });
});
