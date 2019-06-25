/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';

Given(/^I am on Splashscreen page$/, function () {
  cy.visit('/');
});

Given(/^showNetwork setting is true$/, function () {
  cy.addObjectToLocalStorage('settings', 'showNetwork', true);
});

When(/^I explore as guest$/, function () {
  cy.get(ss.exploreAsGuestBtn).click();
});

Given(/^I choose ([^\s]+)$/, function (networkName) {
  switch (networkName) {
    case 'mainnet':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(0).click();
      break;
    case 'testnet':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(1).click();
      break;
    case 'devnet':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type(networks.devnet.node);
      cy.get(ss.connectButton).click();
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type('http://silk.road');
      cy.get(ss.connectButton).click();
      break;
    default:
      throw new Error(`Network should be one of : mainnet , testnet, devnet, invalid . Was: ${networkName}`);
  }
});

Then(/^I should be connected to ([^\s]+)$/, function (networkName) {
  cy.get(ss.networkStatus).contains(`Connected to:${networkName}`);
});
