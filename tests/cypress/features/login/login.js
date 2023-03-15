/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import numeral from 'numeral';
import { networks, ss } from '../../../constants';

Given(/^showNetwork setting is true$/, function () {
  cy.mergeObjectWithLocalStorage('settings', { showNetwork: true });
});

Given(/^I should be connected to ([^\s]+)$/, function (networkName) {
  switch (networkName) {
    case 'mainnet':
      cy.get(ss.networkName).should('have.text', 'mainnet');
      break;
    case 'testnet':
      cy.get(ss.networkName).should('have.text', 'testnet');
      break;
    case 'customNode':
      cy.get(ss.networkName).should('have.text', 'custom node');
      break;
    default:
      throw new Error(`Network should be one of : mainnet , testnet, customNode. Was: ${networkName}`);
  }
  // cy.get(ss.networkName).contains(networkName);
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
    case 'customNode':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).clear().type(networks.customNode.serviceUrl);
      cy.get(ss.connectButton).click();
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type('http://silk.road');
      cy.get(ss.connectButton).click();
      break;
    default:
      throw new Error(`Network should be one of : mainnet , testnet, customNode, invalid . Was: ${networkName}`);
  }
});

Given(/^showNetwork setting is true$/, function () {
  cy.addObjectToLocalStorage('settings', 'showNetwork', true);
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
    case 'customNode':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type(networks.customNode.node);
      cy.get(ss.connectButton).click();
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type('http://silk.road');
      cy.get(ss.connectButton).click();
      break;
    default:
      throw new Error(`Network should be one of : mainnet , testnet, customNode, invalid . Was: ${networkName}`);
  }
});

Then(/^I should be connected to network ([^\s]+)$/, function (networkName) {
  cy.get(ss.networkStatus).contains(`Connected to:${networkName}`);
});

Then(/^I should see lisk monitor features$/, function () {
  cy.get(ss.monitorTransactions).should('have.length', 1);
  cy.get(ss.monitorNetwork).should('have.length', 1);
  cy.get(ss.monitorBlocks).should('have.length', 1);
  cy.get(ss.monitorAccounts).should('have.length', 1);
  cy.get(ss.monitorValidators).should('have.length', 1);
});
