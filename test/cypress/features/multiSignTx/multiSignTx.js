/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { accounts, ss } from '../../../constants';

Then(/^I enter the publicKey of ([^\s]+) at input ([\w]+)$/, function (accountName, index) {
  const passphrase = accounts[accountName]['publicKey'];
  cy.get(ss.msignPkInput).at(index - 1).click();
  cy.get(ss.msignPkInput).at(index - 1).clear().invoke('val', accountName.slice(0, accountName.length - 1)).type(accountName.slice(-1))
});

Then(/^I set 2 inputs as optional$/, function () {
  cy.get(ss.mandatoryToggle).at(1).click();
  cy.get(ss.selectOptional).at(1).click();
  cy.get(ss.mandatoryToggle).at(2).click();
  cy.get(ss.selectOptional).at(2).click();
});

Then(/^I should be able to copy and download transaction$/, function () {
  cy.get(ss.downloadButton).click();
  cy.get(ss.copyButton).click();
});
