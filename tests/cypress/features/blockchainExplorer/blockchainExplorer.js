/* eslint-disable */
import { ss, urls } from '../../../constants';
import mockBlockchainApplications from '../../../fixtures/blockchainApplicationsExplore';
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import moment from 'moment';

const firstChainDetails = mockBlockchainApplications[0];
const secondChainDetails = mockBlockchainApplications[1];

Given(/^I visit blockchain application details link$/, function () {
  cy.visit(`${urls.login}?modal=blockChainApplicationDetails&chainId=${firstChainDetails.chainID}`);
});

Given(/^I visit blockchain applications link$/, function () {
  cy.visit(`${urls.applications}`);
});

Given(/^I toggle pin button for chain id: (.+)$/, function (chainId) {
  cy.wait(100);
  const indexOfPin = mockBlockchainApplications.findIndex((item) => item.chainID === chainId);
  cy.get(ss.chainPinButton).eq(indexOfPin).click({ force: true });
});

Given(/^chain with id: (\w+) should be pinned$/, function (chainId) {
  cy.get(ss.chainPinButton).should('be.visible');
});

Given(/^chain with id: (\w+) should be unpinned$/, function (chainId) {
  cy.get(ss.chainPinButton).should('not.be.visible');
});

Then(/^blockchain applications list should be accurately rendered$/, function () {
  cy.contains('Explore decentralized applications')
    .eq(0)
    .should('have.text', 'Explore decentralized applications');

  cy.get(`${ss.chainRow} .chain-name span`).eq(0).should('have.text', firstChainDetails.name);
  cy.get(`${ss.chainRow} .chain-status`).eq(0).should('have.text', firstChainDetails.state);
  cy.get(`${ss.chainRow} .chain-id span`).eq(0).should('have.text', firstChainDetails.chainID);
  cy.get(`${ss.chainRow} .deposit-amount`).eq(0).should('have.text', '0.5 LSK');

  cy.get(`${ss.chainRow} .chain-name span`).eq(1).should('have.text', secondChainDetails.name);
  cy.get(`${ss.chainRow} .chain-status`).eq(1).should('have.text', secondChainDetails.state);
  cy.get(`${ss.chainRow} .chain-id span`).eq(1).should('have.text', secondChainDetails.chainID);
  cy.get(`${ss.chainRow} .deposit-amount`).eq(1).should('have.text', '5 LSK');
});

Then(/^blockchain applications statistics should be accurately rendered$/, function () {
  cy.contains('Total supply').eq(0).should('have.text', 'Total supply');
  cy.contains('Staked').eq(0).should('have.text', 'Staked');
  cy.get('.stats-info-value').eq(0).should('have.text', '5,000,000 LSK');
  cy.get('.stats-info-value').eq(1).should('have.text', '3,000,000 LSK');
});

Then(/^blockchain details should be accurately displayed$/, function () {
  cy.get(ss.blockchainName).eq(0).should('have.text', firstChainDetails.name);
  cy.get(ss.lastCertHeightDisplay)
    .eq(0)
    .should('have.text', firstChainDetails.lastCertificateHeight);
  cy.get(ss.chainStatusDisplay).eq(0).should('have.text', firstChainDetails.state);
  cy.get(ss.chainOwnerAddress).eq(0).should('have.text', firstChainDetails.address);
  cy.get(ss.lastChainUpdateDisplay)
    .eq(0)
    .should('have.text', moment(firstChainDetails.lastUpdated).format('DD MMM YYYY'));
});

Then(/^blockchain details should not be displayed$/, function () {
  cy.get(ss.blockchainName).should('not.exist');
  cy.get(ss.lastCertHeightDisplay).should('not.exist');
  cy.get(ss.chainOwnerAddress).should('not.exist');
  cy.get(ss.lastChainUpdateDisplay).should('not.exist');
});
