/* eslint-disable */
import { When } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

When(/^I select ([^\s]+) in ([^\s]+) field$/, function (value, field) {
  cy.get(ss[field]).click()
  cy.get('.options').contains(value).click();
});

Then(/^I should be on transaction details page$/, function () {
  cy.location().should((location) => {
    const hasAddress = /\?address=lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt/.test(location.href);
    expect(hasAddress).true;
  });
});
