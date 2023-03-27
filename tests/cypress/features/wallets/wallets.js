/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I should have (\d+) wallets rendered in table$/, function (number) {
  cy.get(ss.walletsRow).should('have.length', number);
});

Then(/^I should be on the wallet page$/, function () {
  cy.location().should((location) => {
    const hasAddress = /\?address=lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt/.test(location.href);
    expect(hasAddress).true;
  });
});
