/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import accounts from '../../../constants/accounts';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import numeral from 'numeral';
import { fromRawLsk } from '../../../../src/utils/lsk';

Given(/^showNetwork setting is true$/, function () {
  cy.mergeObjectWithLocalStorage('settings', { showNetwork: true });
});

Given(/^I should be connected to ([^\s]+)$/, function (networkName) {
  const castNumberToBalanceString = number => (
    numeral(fromRawLsk(number)).format('0,0.[0000000000000]') + ' LSK'
  );
  switch (networkName) {
    case 'mainnet':
      cy.get(ss.networkStatus).should('have.text', 'Connected to:mainnet');
      break;
    case 'testnet':
      cy.get(ss.networkStatus).should('have.text', 'Connected to:testnet');
      break;
    case 'devnet':
      cy.get(ss.networkStatus).should('contain', 'Connected to:devnet');
      break;
    default:
      throw new Error(`Network should be one of : mainnet , testnet, devnet. Was: ${networkName}`);
  }
  cy.get(ss.networkStatus).contains(`Connected to:${networkName}`);
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
      cy.get(ss.addressInput).clear().type(networks.devnet.node);
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

Then(/^I should be connected to network ([^\s]+)$/, function (networkName) {
  cy.get(ss.networkStatus).contains(`Connected to:${networkName}`);
});

Then(/^I should see lisk monitor features$/, function () {
  cy.get(ss.monitorVoting).should('have.length', 1);
  cy.get(ss.monitorTransactions).should('have.length', 1);
  cy.get(ss.monitorNetwork).should('have.length', 1);
  cy.get(ss.monitorBlocks).should('have.length', 1);
  cy.get(ss.monitorAccounts).should('have.length', 1);
  cy.get(ss.monitorDelegates).should('have.length', 1);
});
