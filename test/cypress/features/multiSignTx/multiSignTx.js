/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { accounts, ss } from '../../../constants';

Then(/^I enter the publicKey of ([^\s]+) at input ([\w]+)$/, function (accountName, index) {
  const passphrase = accounts[accountName]['publicKey'];
  cy.get(ss.msignPkInput).at(index - 1).click();
  cy.get(ss.msignPkInput).at(index - 1).clear().invoke('val', accountName.slice(0, accountName.length - 1)).type(accountName.slice(-1))
});

Then(/^I set ([\w]+) inputs as optional$/, function (numOfOptionals) {
  for (let index = 1; index <= numOfOptionals; index++) {
    cy.get(ss.mandatoryToggle).at(index).click();
    cy.get(ss.selectOptional).at(index).click();
  }
});

Then(/^I should be able to copy and download transaction$/, function () {
  cy.get(ss.downloadButton).click();
  cy.get(ss.copyButton).click();
});

Then(/^I paste a transaction$/, function () {
  // TODO
});

Then(/^I read a transaction from json$/, function () {
  // TODO
});
