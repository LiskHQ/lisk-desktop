/* eslint-disable */
import { When } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

When(/^I select ([^\s]+) in ([^\s]+) field$/, function (value, field) {
  cy.get(ss[field]).click()
  cy.get('.options').contains(value).click();
});

Then(/^I should be on transaction details page$/, function () {
  cy.location().should((location) => {
    const hasAddress = /\?transactionId=a1c5521f466ae5476d3908cc8d562444d45adf4ac3af57e77f1f9359999ab9ca/.test(location.href);
    expect(hasAddress).true;
  });
});
