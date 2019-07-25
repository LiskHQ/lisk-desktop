/* eslint-disable */
import { Given } from 'cypress-cucumber-preprocessor/steps';
import urls from '../../../constants/urls';
import accounts from '../../../constants/accounts';
import networks from '../../../constants/networks';
import { setSettings, getSettings } from '../../../constants/settings';
import ss from '../../../constants/selectors';
import numeral from 'numeral';
import { fromRawLsk } from '../../../../src/utils/lsk';

Given(/^showNetwork setting is true$/, function () {
  setSettings(getSettings({ showNetwork: true }));
});

Given(/^I should be connected to ([^\s]+)$/, function (networkName) {
  const castNumberToBalanceString = number => numeral(fromRawLsk(number)).format('0,0.[0000000000000]');
  switch (networkName) {
    case 'mainnet':
      cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
      break;
    case 'testnet':
      cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(accounts['testnet_guy'].balance));
      break;
    case 'devnet':
      cy.get(ss.headerBalance).should('contain', castNumberToBalanceString(accounts.genesis.balance).substring(0, 3));
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
